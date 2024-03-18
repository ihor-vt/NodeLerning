import machineLogSchema from "../model/machineLogModel.js";

export const create = async (req, res) => {
    try {
        const machineLog = new machineLogSchema(req.body);
        const savedMachineLog = await machineLog.save();
        res.status(201).json(savedMachineLog);
    } catch (error) {
        res.status(500).json({ error_messages: 'Internal Server Error.', error: error.message });
    }
};

export const greeting = async (req, res) => {
    try {
        res.json({ message: "Hello World!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const fetch = async (req, res) => {
    try {
        const machineLogs = await machineLogSchema.find().limit(100);
        if (machineLogs.lenght === 0) {
            return res.status(404).json({ error_messages: 'No data found.' });
        };
        res.status(200).json(machineLogs);
    } catch (error) {
        res.status(500).json({ error_messages: 'Internal Server Error.', error: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const id = req.params.id;
        const userExist = await machineLogSchema.findOne({ _id: id });
        if (!userExist) {
            return res.status(404).json({ error_messages: 'Data not found.' });
        };
        const updatedMachineLog = await machineLogSchema.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedMachineLog);
    } catch (error) {
        res.status(500).json({ error_messages: 'Internal Server Error.', error: error.message });
    }
};

export const deleteLog = async (req, res) => {
    try {
        const id = req.params.id;
        const userExist = await machineLogSchema.findOne({ _id: id});
        if (!userExist) {
            return res.status(404).json({ error_messages: 'Data not found.' });
        };
        await machineLogSchema.findByIdAndDelete(id);
        res.status(200).json({ message: 'Machine Log deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error_messages: 'Internal Server Error.', error: error.message });
    }
};

export const getAverage = async (req, res) => {
    try {
        const { deviceitem_id, dt_start, dt_end, interval, method } = req.query;
        const pipeline = [
            {
                "$match": {
                    "deviceitem_id": deviceitem_id,
                    "created_at": {"$gte": new Date(dt_start), "$lt": new Date(dt_end)}
                }
            },
            {
                "$project": {
                    "created_at": 1,
                    "counter": 1,
                    "_id": 0
                }
            },
            {
                "$addFields": {
                    "interval_start": {
                        "$toDate": {
                            "$subtract": [
                                {"$toLong": "$created_at"},
                                {"$mod": [{"$toLong": "$created_at"}, interval * 60 * 1000]}
                            ]
                        }
                    }
                }
            },
            {
                "$group": {
                    "_id": "$interval_start",
                    "counter": {[`$${method}`]: '$counter'},
                }
            },
            {
                "$sort": {"_id": 1}
            },
            {
                "$project": {
                    "timestamp": "$_id",
                    "counter": 1,
                    "_id": 0
                }
            }
        ];

        const result = await machineLogSchema.aggregate(pipeline);

        const output = { deviceitem_id: [], timestamp: [] };
        result.forEach(doc => {
            output.deviceitem_id.push(doc.counter);
            output.timestamp.push(doc.timestamp);
        });

        res.status(200).json(output);
    } catch (error) {
        res.status(500).json({ error_messages: 'Internal Server Error.', error: error.message });
    }
};
