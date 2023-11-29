# ECS272 Final Project

## Team Members

1. Kunal Pai

## Project Description

One of the most pertinent problems in Computer Architecture is the building of a good baseline configuration. A lot of configurations try to match real-life hardware as close as possible, but a problem with that is that hardware datasheets rarely provide all the information to perfectly build a replica of the hardware.

What researchers in the field usually do is arbitrarily guess the parameters they do not know and conduct their experiments using that baseline.

However, there is one way to get more "accurate" baselines: using the stats from the real-life hardware for a set of microbenchmarks. These microbenchmarks are around 36 small programs that as a whole, exercise all the different parts of the system. They have different groups, like Control, Execution, Memory, Store Intense, and Data Dependency, which target the whole system. Therefore, if we optimize to the best \textbf{mean} stats with respect to these microbenchmarks, in theory, we would have a very good baseline model.\cite{kunal2023matchedposter}

While there are a lot of methods to use these microbenchmarks, the method of interest for this project is the greedy algorithm. In this method, a parameter space of the baseline configuration is created with all the possible values of each parameter. After defining the statistics we want to record for each run of these parameters, we can run all the microbenchmarks with them.

The challenge is to find an effective visualization method to visualize numerous values the parameters of the model can take and all the stats that can be measured for all the microbenchmarks. This visualization method should provide the ability to go down an individual microbenchmark, and provide fidelity to view performance on different macro levels (group-wise or overall) to computer architecture researchers as well.

## Data Source

The data collected from a run of the microbenchmarks is in the form of a JSON file. The JSON file contains the following information:

``` json
[
    {
        "parameter": "enableIdling",
        "values": [
            {
                "value": "True",
                "workloads": [
                    {
                        "workload": "riscv-cca-run",
                        "IPC": 1.2098081218798735
                        <MORE STATS>
                    },
                    <MORE WORKLOADS>
                ],
                "average": {
                    "overall": {
                        "IPC": ...
                    },
                    "control" : {
                        "IPC": ...
                    },
                    "execution": {
                        "IPC": ...
                    },
                    "memory" : {
                        "IPC": ...
                    },
                    "store_intense": {
                        "IPC": ...
                    },
                    "data_dependency" : {
                        "IPC": ...
                    }
                }
            },
            {
                "value": "False",
                "workloads": [
                    {
                        "workload": "riscv-cca-run",
                        "IPC": 1.2098131875912785,
                        <MORE STATS>
                    },
                    <MORE WORKLOADS>
                ],
                "average": {
                    "overall": {
                        "IPC": ...
                    },
                    "control" : {
                        "IPC": ...
                    },
                    "execution": {
                        "IPC": ...
                    },
                    "memory" : {
                        "IPC": ...
                    },
                    "store_intense": {
                        "IPC": ...
                    },
                    "data_dependency" : {
                        "IPC": ...
                    }
                }
            }
        ]
    },
    <MORE PARAMETERS>
]
```
