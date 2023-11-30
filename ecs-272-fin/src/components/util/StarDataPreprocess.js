const preProcessAncil1Data = (data) => {
    const transformedData = {};
    data.forEach((d) => {
        const parameter = d.Parameter;
        const value = d.Value;
        const key = `${parameter}-${value}`;
        const transformedItem = {
            Instructions: parseFloat(d["Instructions"]).toFixed(3),
            Cycles: parseFloat(d["Cycles"]).toFixed(3),
            IPC: parseFloat(d["IPC"]).toFixed(3),
            Seconds: parseFloat(d["Seconds"]).toFixed(3),
            Branches: parseFloat(d["Branches"]).toFixed(3),
        };

        for (const prop in transformedItem) {
            if (isNaN(transformedItem[prop])) {
                transformedItem[prop] = 1;
            }
        }

        transformedData[key] = transformedItem;
    });
    return transformedData;
};

const preProcessAncil2Data = (data) => {
    const transformedData = {};
    data.forEach((d) => {
        const parameter = d.Parameter;
        const value = d.Value;
        const key = `${parameter}-${value}`;
        const transformedItem = {
            Store_Intense: parseFloat(d["store_intense"]).toFixed(3),
            Control: parseFloat(d["control"]).toFixed(3),
            Execution: parseFloat(d["execution"]).toFixed(3),
            Memory: parseFloat(d["memory"]).toFixed(3),
            Data_Dependency: parseFloat(d["data_dependency"]).toFixed(3),
        };

        for (const prop in transformedItem) {
            if (isNaN(transformedItem[prop])) {
                transformedItem[prop] = 1;
            }
        }

        transformedData[key] = transformedItem;
    });
    return transformedData;
};

const preProcessAncil3Data = (data,view) => {
    const transformedData = {};
    if (view.includes('Memory')) {
        data.forEach((d) => {
            const parameter = d.Parameter;
            const value = d.Value;
            const key = `${parameter}-${value}`;
            const transformedItem = {
                ML2: parseFloat(d["ml2"]).toFixed(3),
                MC: parseFloat(d["mc"]).toFixed(3),
                MIM2: parseFloat(d["mim2"]).toFixed(3),
                M: parseFloat(d["m"]).toFixed(3),
                MI: parseFloat(d["mi"]).toFixed(3),
                MIM: parseFloat(d["mim"]).toFixed(3),
                MCS : parseFloat(d["mcs"]).toFixed(3),
                MD : parseFloat(d["md"]).toFixed(3),
                MIP: parseFloat(d["mip"]).toFixed(3),
            };

            for (const prop in transformedItem) {
                if (isNaN(transformedItem[prop])) {
                    transformedItem[prop] = 1;
                }
            }

            transformedData[key] = transformedItem;
        });
    } else if (view.includes('Control')) {
        data.forEach((d) => {
            const parameter = d.Parameter;
            const value = d.Value;
            const key = `${parameter}-${value}`;
            const transformedItem = {
                CS1: parseFloat(d["cs1"]).toFixed(3),
                CRf: parseFloat(d["crf"]).toFixed(3),
                CCm: parseFloat(d["ccm"]).toFixed(3),
                CCa: parseFloat(d["cca"]).toFixed(3),
                CCe: parseFloat(d["cce"]).toFixed(3),
                CCh: parseFloat(d["cch"]).toFixed(3),
                CS3: parseFloat(d["cs3"]).toFixed(3),
                CRd: parseFloat(d["crd"]).toFixed(3),
                CCI: parseFloat(d["cci"]).toFixed(3),
            };

            for (const prop in transformedItem) {
                if (isNaN(transformedItem[prop])) {
                    transformedItem[prop] = 1;
                }
            }

            transformedData[key] = transformedItem;
        }
        );
    } else if (view.includes('Execution')) {
        data.forEach((d) => {
            const parameter = d.Parameter;
            const value = d.Value;
            const key = `${parameter}-${value}`;
            const transformedItem = {
                EM5: parseFloat(d["em5"]).toFixed(3),
                EM1: parseFloat(d["em1"]).toFixed(3),
                EI: parseFloat(d["ei"]).toFixed(3),
                ED1: parseFloat(d["ed1"]).toFixed(3),
            };

            for (const prop in transformedItem) {
                if (isNaN(transformedItem[prop])) {
                    transformedItem[prop] = 1;
                }
            }

            transformedData[key] = transformedItem;
        });
    } else if (view.includes('Data_Dependency')) {
        data.forEach((d) => {
            const parameter = d.Parameter;
            const value = d.Value;
            const key = `${parameter}-${value}`;
            const transformedItem = {
                DPT: parseFloat(d["dpt"]).toFixed(3),
                DPTd: parseFloat(d["dptd"]).toFixed(3),
                DPCVt: parseFloat(d["dpcvt"]).toFixed(3),
                DP1f: parseFloat(d["dp1f"]).toFixed(3),
                DP1d: parseFloat(d["dp1d"]).toFixed(3),
            };

            for (const prop in transformedItem) {
                if (isNaN(transformedItem[prop])) {
                    transformedItem[prop] = 1;
                }
            }

            transformedData[key] = transformedItem;
        });
    } else if (view.includes('Store_Intense')) {
        data.forEach((d) => {
            const parameter = d.Parameter;
            const value = d.Value;
            const key = `${parameter}-${value}`;
            const transformedItem = {
                STL2: parseFloat(d["stl2"]).toFixed(3),
                STc: parseFloat(d["stc"]).toFixed(3),
            };

            for (const prop in transformedItem) {
                if (isNaN(transformedItem[prop])) {
                    transformedItem[prop] = 1;
                }
            }

            transformedData[key] = transformedItem;
        });
    }
    return transformedData;
}

export { preProcessAncil1Data, preProcessAncil2Data, preProcessAncil3Data };