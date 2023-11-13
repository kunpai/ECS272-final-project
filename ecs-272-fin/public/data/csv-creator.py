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
        overall = value["average"]["overall"]
        overall_instructions = value["average"]["overall"]["Instructions"]
        overall_cycles = value["average"]["overall"]["Cycles"]
        overall_IPC = value["average"]["overall"]["IPC"]
        overall_seconds = value["average"]["overall"]["Seconds"]
        overall_branches = value["average"]["overall"]["Branches"]

        print(f"Value: {value_name}")
        print(f"overall: {overall}")

        # put the data into a table
        table[str(parameter) + "_" + str(value_name)] = {
            "Parameter": parameter,
            "Value": value_name,
            "Instructions": overall_instructions,
            "Cycles": overall_cycles,
            "IPC": overall_IPC,
            "Seconds": overall_seconds,
            "Branches": overall_branches
        }

# create a csv file from the table dropping the index
df = pd.DataFrame.from_dict(table, orient='index')
df.to_csv('overall-stats.csv', index=False)