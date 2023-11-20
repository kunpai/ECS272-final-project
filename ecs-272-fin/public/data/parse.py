# open baseline-stats.csv

import csv
import json

# open baseline-stats.csv
with open('baseline-stats.csv', 'r') as f:
    reader = csv.reader(f)
    baseline = list(reader)

for base in baseline:
    print(base)
    try:
        base.append(str((float(base[1])/float(base[2]))* float(base[2])*1/(10**8)))
    except:
        base.append("Seconds")

# write to baseline-stats.csv
with open('baseline-stats.csv', 'w') as f:
    writer = csv.writer(f)
    writer.writerows(baseline)