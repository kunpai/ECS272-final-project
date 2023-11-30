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
        overall_branches = value["average"]["overall"]["Branches"]
        control_branches = value["average"]["control"]["Branches"]
        memory_branches = value["average"]["memory"]["Branches"]
        execution_branches = value["average"]["execution"]["Branches"]
        data_dependency_branches = value["average"]["data_dependency"]["Branches"]
        store_intense_branches = value["average"]["store_intense"]["Branches"]
        # overall_branches = value["average"]["overall"]["branches"]
        # overall_branches = value["average"]["overall"]["branches"]
        # overall_branches = value["average"]["overall"]["branches"]
        # overall_branches = value["average"]["overall"]["Branches"]

        print(f"Value: {value_name}")
        print(f"overall: {overall}")

        # put the data into a table
        table[str(parameter) + "_" + str(value_name)] = {
            "Parameter": parameter,
            "Value": value_name,
            "overall branches": overall_branches,
            "control branches": control_branches,
            "execution branches": execution_branches,
            "memory branches": memory_branches,
            "data_dependency branches": data_dependency_branches,
            "store_intense branches": store_intense_branches,
        }

# create a csv file from the table dropping the index
df = pd.DataFrame.from_dict(table, orient='index')
df.to_csv('branches-stats.csv', index=False)