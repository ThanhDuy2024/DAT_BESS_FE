const bmsDataTemplate2 = [
    {
        id: 1,
        rackName: "rack1level_04",
        model: "rack1level",
        band: "Hithium",
        template: {
            status: {
                register: "100-1",
                scale: 0,
                offset: 0,
                type: "word"
            },
            voltage: {
                register: "115-1",
                scale: 0.1,
                offset: 0,
                type: "word"
            },
            current: {
                register: "116-1",
                scale: 0.1,
                offset: -3200,
                type: "word"
            },
            temperature: {
                regiser: "117-1",
                scale: 1,
                offset: -40,
                type: "word"
            },
            soc: {
                register: "118-1",
                scale: 1,
                offset: 0,
                type: "word"
            },
            soh: {
                register: "119-1",
                scale: 1,
                offset: 0,
                type: "word"
            },
            maximumCellVoltage: {
                register: "123-1",
                scale: 0.001,
                offset: 0,
                type: "word"
            },
            minimumCellVoltage: {
                register: "125-1",
                scale: 0.001,
                offset: 0,
                type: "word"
            },
            maximumCellTemperature: {
                register: "127-1",
                scale: 1,
                offset: -40,
                type: "word"
            },
            minimumCellTemperature: {
                register: "129-1",
                scale: 1,
                offset: -40,
                type: "word"
            },

        },
        module: [
            {
                moduleName: "Module 01",
                startAddress: 191,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 02",
                startAddress: 296,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 03",
                startAddress: 400,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 04",
                startAddress: 504,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 05",
                startAddress: 609,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 06",
                startAddress: 714,
                totalCell: 104,
                cell: []
            },
        ]
    },
    {
        id: 2,
        rackName: "rack2level_04",
        model: "rack2level",
        band: "Hithium",
        template: {
            status: {
                register: "3100-1",
                scale: 0,
                offset: 0,
                type: "word"
            },
            voltage: {
                register: "3115-1",
                scale: 0.1,
                offset: 0,
                type: "word"
            },
            current: {
                register: "3116-1",
                scale: 0.1,
                offset: -3200,
                type: "word"
            },
            temperature: {
                regiser: "3117-1",
                scale: 1,
                offset: -40,
                type: "word"
            },
            soc: {
                register: "3118-1",
                scale: 1,
                offset: 0,
                type: "word"
            },
            soh: {
                register: "3119-1",
                scale: 1,
                offset: 0,
                type: "word"
            },
            maximumCellVoltage: {
                register: "3123-1",
                scale: 0.001,
                offset: 0,
                type: "word"
            },
            minimumCellVoltage: {
                register: "3125-1",
                scale: 0.001,
                offset: 0,
                type: "word"
            },
            maximumCellTemperature: {
                register: "3127-1",
                scale: 1,
                offset: -40,
                type: "word"
            },
            minimumCellTemperature: {
                register: "3129-1",
                scale: 1,
                offset: -40,
                type: "word"
            },

        },
        module: [
            {
                moduleName: "Module 01",
                startAddress: 3191,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 02",
                startAddress: 3296,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 03",
                startAddress: 3400,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 04",
                startAddress: 3504,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 05",
                startAddress: 3609,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 06",
                startAddress: 3714,
                totalCell: 104,
                cell: []
            },
        ]
    },
    {
        id: 3,
        rackName: "rack3level_04",
        model: "rack3level",
        band: "Hithium",
        template: {
            status: {
                register: "6100-1",
                scale: 0,
                offset: 0,
                type: "word"
            },
            voltage: {
                register: "6115-1",
                scale: 0.1,
                offset: 0,
                type: "word"
            },
            current: {
                register: "6116-1",
                scale: 0.1,
                offset: -3200,
                type: "word"
            },
            temperature: {
                regiser: "6117-1",
                scale: 1,
                offset: -40,
                type: "word"
            },
            soc: {
                register: "6118-1",
                scale: 1,
                offset: 0,
                type: "word"
            },
            soh: {
                register: "6119-1",
                scale: 1,
                offset: 0,
                type: "word"
            },
            maximumCellVoltage: {
                register: "6123-1",
                scale: 0.001,
                offset: 0,
                type: "word"
            },
            minimumCellVoltage: {
                register: "6125-1",
                scale: 0.001,
                offset: 0,
                type: "word"
            },
            maximumCellTemperature: {
                register: "6127-1",
                scale: 1,
                offset: -40,
                type: "word"
            },
            minimumCellTemperature: {
                register: "6129-1",
                scale: 1,
                offset: -40,
                type: "word"
            },

        },
        module: [
            {
                moduleName: "Module 01",
                startAddress: 6191,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 02",
                startAddress: 6296,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 03",
                startAddress: 6400,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 04",
                startAddress: 6504,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 05",
                startAddress: 6609,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 06",
                startAddress: 6714,
                totalCell: 104,
                cell: []
            },
        ]
    },
    {
        id: 4,
        rackName: "rack4level_04",
        model: "rack4level",
        band: "Hithium",
        template: {
            status: {
                register: "9100-1",
                scale: 0,
                offset: 0,
                type: "word"
            },
            voltage: {
                register: "9115-1",
                scale: 0.1,
                offset: 0,
                type: "word"
            },
            current: {
                register: "9116-1",
                scale: 0.1,
                offset: -3200,
                type: "word"
            },
            temperature: {
                regiser: "9117-1",
                scale: 1,
                offset: -40,
                type: "word"
            },
            soc: {
                register: "9118-1",
                scale: 1,
                offset: 0,
                type: "word"
            },
            soh: {
                register: "9119-1",
                scale: 1,
                offset: 0,
                type: "word"
            },
            maximumCellVoltage: {
                register: "9123-1",
                scale: 0.001,
                offset: 0,
                type: "word"
            },
            minimumCellVoltage: {
                register: "9125-1",
                scale: 0.001,
                offset: 0,
                type: "word"
            },
            maximumCellTemperature: {
                register: "9127-1",
                scale: 1,
                offset: -40,
                type: "word"
            },
            minimumCellTemperature: {
                register: "9129-1",
                scale: 1,
                offset: -40,
                type: "word"
            },

        },
        module: [
            {
                moduleName: "Module 01",
                startAddress: 9191,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 02",
                startAddress: 9296,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 03",
                startAddress: 9400,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 04",
                startAddress: 9504,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 05",
                startAddress: 9609,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 06",
                startAddress: 9714,
                totalCell: 104,
                cell: []
            },
        ]
    },
    {
        id: 5,
        rackName: "rack5level_04",
        model: "rack5level",
        band: "Hithium",
        template: {
            status: {
                register: "12100-1",
                scale: 0,
                offset: 0,
                type: "word"
            },
            voltage: {
                register: "12115-1",
                scale: 0.1,
                offset: 0,
                type: "word"
            },
            current: {
                register: "12116-1",
                scale: 0.1,
                offset: -3200,
                type: "word"
            },
            temperature: {
                regiser: "12117-1",
                scale: 1,
                offset: -40,
                type: "word"
            },
            soc: {
                register: "12118-1",
                scale: 1,
                offset: 0,
                type: "word"
            },
            soh: {
                register: "12119-1",
                scale: 1,
                offset: 0,
                type: "word"
            },
            maximumCellVoltage: {
                register: "12123-1",
                scale: 0.001,
                offset: 0,
                type: "word"
            },
            minimumCellVoltage: {
                register: "12125-1",
                scale: 0.001,
                offset: 0,
                type: "word"
            },
            maximumCellTemperature: {
                register: "12127-1",
                scale: 1,
                offset: -40,
                type: "word"
            },
            minimumCellTemperature: {
                register: "12129-1",
                scale: 1,
                offset: -40,
                type: "word"
            },

        },
        module: [
            {
                moduleName: "Module 01",
                startAddress: 12191,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 02",
                startAddress: 12296,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 03",
                startAddress: 12400,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 04",
                startAddress: 12504,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 05",
                startAddress: 12609,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 06",
                startAddress: 12714,
                totalCell: 104,
                cell: []
            },
        ]
    },
    {
        id: 6,
        rackName: "rack6level_04",
        model: "rack6level",
        band: "Hithium",
        template: {
            status: {
                register: "15100-1",
                scale: 0,
                offset: 0,
                type: "word"
            },
            voltage: {
                register: "15115-1",
                scale: 0.1,
                offset: 0,
                type: "word"
            },
            current: {
                register: "15116-1",
                scale: 0.1,
                offset: -3200,
                type: "word"
            },
            temperature: {
                regiser: "15117-1",
                scale: 1,
                offset: -40,
                type: "word"
            },
            soc: {
                register: "15118-1",
                scale: 1,
                offset: 0,
                type: "word"
            },
            soh: {
                register: "15119-1",
                scale: 1,
                offset: 0,
                type: "word"
            },
            maximumCellVoltage: {
                register: "15123-1",
                scale: 0.001,
                offset: 0,
                type: "word"
            },
            minimumCellVoltage: {
                register: "15125-1",
                scale: 0.001,
                offset: 0,
                type: "word"
            },
            maximumCellTemperature: {
                register: "15127-1",
                scale: 1,
                offset: -40,
                type: "word"
            },
            minimumCellTemperature: {
                register: "15129-1",
                scale: 1,
                offset: -40,
                type: "word"
            },

        },
        module: [
            {
                moduleName: "Module 01",
                startAddress: 15191,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 02",
                startAddress: 15296,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 03",
                startAddress: 15400,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 04",
                startAddress: 15504,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 05",
                startAddress: 15609,
                totalCell: 104,
                cell: []
            },
            {
                moduleName: "Module 06",
                startAddress: 15714,
                totalCell: 104,
                cell: []
            },
        ]
    },
]

const sinh = (bmsDataTemplate2) => {
    for (const item of bmsDataTemplate2) {
        for (const item2 of item.module) {
            const index = item2.startAddress;
            for (let i = index; i <= index + (item2.totalCell - 1); i++) {
                const obj = {
                    cellVoltage: {
                        register: `${i}-1`,
                        scale: 0.001,
                        offset: 0,
                        type: "word"
                    },
                    cellTemperature: {
                        register: `${i + 700}-1`,
                        scale: 1,
                        offset: -40,
                        type: "word"
                    },
                    cellSoc: {
                        register: `${i + 700 + 700}-1`,
                        scale: 1,
                        offset: 0
                    },
                    cellSoh: {
                        register: `${i + 700 + 700 + 700}-1`,
                        scale: 1,
                        offset: 0
                    }
                };
                item2.cell.push(obj);
            }
        }
    };
    return bmsDataTemplate2
}

export const bmsDataTemplate = sinh(bmsDataTemplate2);