import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

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
        print(f"Overall: {overall}")

        # put the data into a table
        table[str(parameter) + "_" + str(value_name)] = {
            "parameter": parameter,
            "value": value_name,
            "overall_instructions": overall_instructions,
            "overall_cycles": overall_cycles,
            "overall_IPC": overall_IPC,
            "overall_seconds": overall_seconds,
            "overall_branches": overall_branches
        }

# convert the table into a dataframe with the keys as columns
df = pd.DataFrame.from_dict(table, orient='index')

# store the parameter and value columns in a separate dataframe
df_params = df[["parameter", "value"]]

df.drop(["parameter", "value"], axis=1, inplace=True)
print(df)
print(df_params)


# print(df)

# # normalize every column
# df = df.apply(lambda x: (x - np.mean(x)) / (np.max(x) - np.min(x)))

# # make every NaN value 0
# df = df.fillna(0)

# Standardize the data
scaled_data = StandardScaler().fit_transform(df)

# Apply PCA
num_components = 2
pca = PCA(n_components=num_components)
principal_components = pca.fit_transform(scaled_data)

# Examine explained variance
explained_variance_ratio = pca.explained_variance_ratio_
print("Explained Variance Ratio:", explained_variance_ratio)

# Get the principal components (coefficients)
components = pca.components_
print("Principal Components:", principal_components)
# make a dataframe with the principal components
principal_components = pd.DataFrame(data=principal_components, columns=['PC1', 'PC2'])

# create a dataframe with columns: parameter, value, PC1, PC2
# parameter and values are in df_params
# PC1 and PC2 are in principal_components
# Merge the DataFrames on a common key (e.g., index, if applicable)
df_params = df_params.reset_index(drop=True)
principal_components = principal_components.reset_index(drop=True)

# Merge the DataFrames on a common key (e.g., index, if applicable)
result_df = pd.concat([df_params, principal_components], axis=1)

# Print the resulting DataFrame
print(result_df)

# drop the index column
result_df.to_csv('pca.csv', index=False)


# # Plot the scatter plot with the first two PCs
# plt.scatter(principal_components[:, 0], principal_components[:, 1])
# plt.title('Scatter Plot of Principal Components')
# plt.xlabel('Principal Component 1')
# plt.ylabel('Principal Component 2')
# plt.show()

# Visualize the contribution of each feature to the PCs
feature_names = df.columns
for i, (pc, component) in enumerate(zip(range(1, num_components + 1), components), 1):
    print(f"PC {i}:")
    print(component)
    print(f"Feature Names: {feature_names}")
    # write the data to a csv file
    with open(f"pc{i}.csv", "w") as f:
        f.write("feature,component\n")
        for feature, value in zip(feature_names, component):
            f.write(f"{feature},{value}\n")

    # plt.bar(feature_names, component, label=f'PC {i}')
    # plt.xlabel('Features')
    # plt.ylabel('Component Value')
    # plt.title(f'Contribution of Features to Principal Component {i}')
    # # write the data to a csv file
    # plt.legend()
    # plt.show()
