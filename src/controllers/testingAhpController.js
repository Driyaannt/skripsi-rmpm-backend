const { db, sequelizeInstances} = require("../../config/sequelize");
const response = require("../tools/response");
const { Op, Sequelize } = require('sequelize');
const kedatangan = db.testingAhp.trKedatangan;
const alternatif = db.testingAhp.alternatif;
const mstVarian = db.testingAhp.mstVarian;
const ahpCalculations = db.testingAhp.ahpCalculations;
const ahpComparisonMatrices = db.testingAhp.ahpComparisonMatrices;
const ahpPriorityVectors = db.testingAhp.ahpPriorityVectors;
const ahpFinalResults = db.testingAhp.ahpFinalResults;
const ahpVendorData = db.testingAhp.ahpVendorData;
const ahpNormalizedMatrices = db.testingAhp.ahpNormalizedMatrices;
// const ahpCriteriaWeights = db.testingAhp.ahpCriteriaWeights;


exports.calculateAHPScores = async (req, res) => {
    const sequelize = sequelizeInstances.testingAhp; // Assuming you have multiple instances
    
    if (!sequelize) {
        return response(res, 500, false, "Database connection not established");
    }

    const transaction = await sequelize.transaction();
    try {
        const { year, location, materialCode, userId } = req.body;

        // 1. Create calculation record
        const calculation = await ahpCalculations.create({
            year,
            location: location === 'all' ? null : location,
            material_code: materialCode,
            created_by: userId || 'system'
        }, { transaction });

        // 2. Get vendor data from tr_kedatangan
        const vendorData = await kedatangan.findAll({
            where: {
                tanggal_terima: {
                    [Op.between]: [`${year}-01-01`, `${year}-12-31`]
                },
                ...(location !== 'all' && { location }),
                nama_variant: materialCode
            },
            attributes: [
                'nama_suplier',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'total_transactions'],
                [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN terlambat = 0 THEN 1 ELSE 0 END')), 'on_time_transactions'],
                [Sequelize.fn('SUM', Sequelize.col('jumlah_dikirim')), 'total_capacity'],
                [Sequelize.fn('AVG', Sequelize.literal('(jumlah_diterima / jumlah_dikirim) * 100')), 'avg_quality']
            ],
            group: ['nama_suplier'],
            raw: true,
            transaction
        });

        // 3. Get price data from vendor price table
        const vendorPrices = await alternatif.findAll({
            include: [{
                model: mstVarian,
                as: 'varian',
                required: true,
                where: { kode_material: materialCode }
            }],
            raw: true,
            transaction
        });

        if (vendorData.length === 0 || vendorPrices.length === 0) {
            await transaction.rollback();
            return res.status(400).json({
                status: 400,
                success: false,
                message: "No data found for the selected criteria",
                from: process.env.SERVICE_NAME,
                data: null
            });
        }

        // 4. Prepare vendor performance data and save to database
        const vendors = await Promise.all(vendorData.map(async vendor => {
            const priceInfo = vendorPrices.find(p => p.nama_alternatif === vendor.nama_suplier);
            const vendorObj = {
                vendor: vendor.nama_suplier,
                deliveryAccuracy: vendor.total_transactions > 0
                    ? (vendor.on_time_transactions / vendor.total_transactions) * 100
                    : 0,
                price: priceInfo ? priceInfo.harga : 0,
                capacity: priceInfo ? priceInfo.kapasitas : 0,
                quality: vendor.avg_quality || 0
            };

            await ahpVendorData.create({
                calculation_id: calculation.id,
                vendor_name: vendorObj.vendor,
                total_transactions: vendor.total_transactions,
                on_time_transactions: vendor.on_time_transactions,
                total_capacity: vendorObj.capacity,
                avg_quality: vendorObj.quality,
                price: vendorObj.price
            }, { transaction });

            return vendorObj;
        }));

        // 5. AHP Scale conversion function
        const convertToAHPScale = (ratio) => {
            if (ratio === 0) return 0;
            if (ratio <= 1.2) return 1;
            if (ratio <= 1.4) return 2;
            if (ratio <= 1.6) return 3;
            if (ratio <= 2) return 4;
            if (ratio <= 3) return 5;
            if (ratio <= 4) return 6;
            if (ratio <= 5) return 7;
            if (ratio <= 7) return 8;
            return 9;
        };

        // 6. Create and save comparison matrices
        const createAndSaveComparisonMatrix = async (criteria, reverseComparison = false) => {
            const matrix = [];
            const header = ['Vendor', ...vendors.map(v => v.vendor)];
            matrix.push(header);

            for (let i = 0; i < vendors.length; i++) {
                const row = [vendors[i].vendor];
                for (let j = 0; j < vendors.length; j++) {
                    if (j > i) {
                        row.push('-');
                    } else if (i === j) {
                        row.push(1);
                    } else {
                        let ratio = vendors[j][criteria] / vendors[i][criteria];
                        if (reverseComparison) {
                            ratio = vendors[i][criteria] / vendors[j][criteria];
                        }
                        if (ratio < 1) ratio = 1 / ratio;
                        row.push(convertToAHPScale(ratio));
                    }
                }
                matrix.push(row);
            }

            for (let i = 1; i < matrix.length; i++) {
                for (let j = 1; j < matrix[i].length; j++) {
                    if (matrix[i][j] === '-') {
                        const inverse = matrix[j][i];
                        matrix[i][j] = typeof inverse === 'number' ? parseFloat((1 / inverse).toFixed(4)) : inverse;
                    }
                }
            }

            await ahpComparisonMatrices.create({
                calculation_id: calculation.id,
                criteria,
                matrix_data: { header, data: matrix.slice(1) }
            }, { transaction });

            return matrix;
        };

        // 7. Create all comparison matrices
        const deliveryAccuracyMatrix = await createAndSaveComparisonMatrix('deliveryAccuracy');
        const priceMatrix = await createAndSaveComparisonMatrix('price', true);
        const capacityMatrix = await createAndSaveComparisonMatrix('capacity');
        const qualityMatrix = await createAndSaveComparisonMatrix('quality');

        // 8. Normalize matrix and save
        const normalizeAndSaveMatrix = async (matrix, criteria) => {
            const normalized = JSON.parse(JSON.stringify(matrix));
            const columnSums = [];

            for (let j = 1; j < normalized[0].length; j++) {
                let sum = 0;
                for (let i = 1; i < normalized.length; i++) {
                    if (typeof normalized[i][j] === 'number') {
                        sum += normalized[i][j];
                    }
                }
                columnSums.push(sum);
            }

            for (let i = 1; i < normalized.length; i++) {
                for (let j = 1; j < normalized[i].length; j++) {
                    if (typeof normalized[i][j] === 'number') {
                        normalized[i][j] = parseFloat((normalized[i][j] / columnSums[j - 1]).toFixed(4));
                    }
                }
            }

            await ahpNormalizedMatrices.create({
                calculation_id: calculation.id,
                criteria,
                normalized_matrix: {
                    header: normalized[0],
                    data: normalized.slice(1)
                }
            }, { transaction });

            return normalized;
        };

        // 9. Normalize all matrices
        const normalizedDeliveryAccuracy = await normalizeAndSaveMatrix(deliveryAccuracyMatrix, 'delivery_accuracy');
        const normalizedPrice = await normalizeAndSaveMatrix(priceMatrix, 'price');
        const normalizedCapacity = await normalizeAndSaveMatrix(capacityMatrix, 'capacity');
        const normalizedQuality = await normalizeAndSaveMatrix(qualityMatrix, 'quality');

        // 10. Calculate and save priority vectors
        const calculateAndSavePriorityVector = async (normalizedMatrix, criteria) => {
            const priorityVector = [];

            for (let i = 1; i < normalizedMatrix.length; i++) {
                let sum = 0;
                let count = 0;

                for (let j = 1; j < normalizedMatrix[i].length; j++) {
                    if (typeof normalizedMatrix[i][j] === 'number') {
                        sum += normalizedMatrix[i][j];
                        count++;
                    }
                }

                const priorityValue = parseFloat((sum / count).toFixed(4));
                priorityVector.push({
                    vendor: normalizedMatrix[i][0],
                    priority: priorityValue
                });

                await ahpPriorityVectors.create({
                    calculation_id: calculation.id,
                    criteria,
                    vendor_name: normalizedMatrix[i][0],
                    priority_value: priorityValue
                }, { transaction });
            }

            return priorityVector;
        };

        // 11. Calculate all priority vectors
        const deliveryAccuracyPV = await calculateAndSavePriorityVector(normalizedDeliveryAccuracy, 'delivery_accuracy');
        const pricePV = await calculateAndSavePriorityVector(normalizedPrice, 'price');
        const capacityPV = await calculateAndSavePriorityVector(normalizedCapacity, 'capacity');
        const qualityPV = await calculateAndSavePriorityVector(normalizedQuality, 'quality');

        // 12. Get and save criteria weights
        // const bobot = await ahpCriteriaWeights.findAll({ raw: true});

        const bobot = [
            { criteria_name: 'delivery_accuracy', weight: 0.0523 },
            { criteria_name: 'price', weight: 0.2410 },
            { criteria_name: 'capacity', weight: 0.0846},
            { criteria_name: 'quality', weight: 0.6221 }
        ]
        const criteriaWeights = {};
        const criteriaList = ['delivery_accuracy', 'price', 'capacity', 'quality'];

        await Promise.all(bobot.map(async weight => {
            if (criteriaList.includes(weight.criteria_name)) {
                criteriaWeights[weight.criteria_name] = weight.weight;
                // await ahpCriteriaWeights.create({
                //     calculation_id: calculation.id,
                //     criteria_name: weight.criteria_name,
                //     weight: weight.weight
                // }, { transaction });
            }
        }));

        // 13. Calculate global priorities
        const calculateGlobalPriority = () => {
            return vendors.map(vendor => {
                const getPriority = (pv, vendorName) =>
                    pv?.find(p => p.vendor === vendorName)?.priority || 0;

                const da = getPriority(deliveryAccuracyPV, vendor.vendor);
                const p = getPriority(pricePV, vendor.vendor);
                const cap = getPriority(capacityPV, vendor.vendor);
                const q = getPriority(qualityPV, vendor.vendor);

                const globalPriority =
                    (da * criteriaWeights.delivery_accuracy) +
                    (p * criteriaWeights.price) +
                    (cap * criteriaWeights.capacity) +
                    (q * criteriaWeights.quality);

                return {
                    vendor: vendor.vendor,
                    deliveryAccuracyScore: da,
                    priceScore: p,
                    capacityScore: cap,
                    qualityScore: q,
                    totalScore: parseFloat(globalPriority.toFixed(4))
                };
            }).sort((a, b) => b.totalScore - a.totalScore);
        };

        const finalResults = calculateGlobalPriority();

        // console total scores
        finalResults.forEach(result => {
            console.log(`Vendor: ${result.vendor}, Total Score: ${result.totalScore}`);
        });

        // 14. Save final results
        await Promise.all(finalResults.map(async (result, index) => {
            await ahpFinalResults.create({
                calculation_id: calculation.id,
                vendor_name: result.vendor,
                delivery_accuracy_score: result.deliveryAccuracyScore,
                price_score: result.priceScore,
                capacity_score: result.capacityScore,
                quality_score: result.qualityScore,
                total_score: result.totalScore,
                ranking: index + 1
            }, { transaction });
        }));

        await transaction.commit();

        // 15. Prepare response
        const responseData = {
            calculationId: calculation.id,
            year: calculation.year,
            location: calculation.location,
            materialCode: calculation.material_code,
            results: finalResults.map(r => ({
                vendor: r.vendor,
                deliveryAccuracyScore: r.deliveryAccuracyScore,
                priceScore: r.priceScore,
                capacityScore: r.capacityScore,
                qualityScore: r.qualityScore,
                totalScore: r.totalScore,
                ranking: finalResults.findIndex(fr => fr.vendor === r.vendor) + 1
            })),
            criteriaWeights
        };

        return res.status(200).json({
            status: 200,
            success: true,
            message: "AHP calculation completed successfully",
            from: process.env.SERVICE_NAME,
            data: responseData
        });

    } catch (error) {
        await transaction.rollback();
        console.error("Error in AHP calculation:", error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: "Internal server error",
            from: process.env.SERVICE_NAME,
            data: null
        });
    }
};