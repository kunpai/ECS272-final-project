import json
import numpy as np
import pandas as pd

with open('results.json') as f:
    data = json.load(f)

table = {}

for item in data:
    parameter = item["parameter"]
    values = item["values"]

    print(f"Parameter: {parameter}")
    print("Values:")
    for value in values:
        value_name = value["value"]
        print(f"Value: {value_name}")
        workloads = value["workloads"]
        table[str(parameter) + "_" + str(value_name)] = {
            "Parameter": parameter,
            "Value": value_name
        }
        print("Workloads:")
        for workload in workloads:
            workload_name = workload["workload"]
            if workload_name.split("-")[1].startswith("s"):
                microbenchmark = workload_name.split("-")[1]
                stat = workload["stats"]["IPC"]
                print(microbenchmark)
                print(stat)
                table[str(parameter) + "_" + str(value_name)][microbenchmark] = stat

df = pd.DataFrame.from_dict(table, orient='index')
df.to_csv('Store_Intense-IPC.csv', index=False)