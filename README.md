# ECS272 Final Project

## Team Members

1. Kunal Pai

## Project Description

One of the most pertinent problems in Computer Architecture is the building of a good baseline configuration. A lot of configurations try to match real-life hardware as close as possible, but a problem with that is that hardware datasheets rarely provide all the information to perfectly build a replica of the hardware.

What researchers in the field usually do is arbitrarily guess the parameters they do not know and conduct their experiments using that baseline.

However, there is one way to get more "accurate" baselines: using the stats from the real-life hardware for a set of microbenchmarks. These microbenchmarks are around 36 small programs that as a whole, exercise all the different parts of the system. They have different groups, like Control, Execution, Memory, Store Intense, and Data Dependency, which target the whole system. Therefore, if we optimize to the best mean stats with respect to these microbenchmarks, in theory, we would have a very good baseline model.

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

## Visualization

The main visualization is a PCA 2D scatterplot. The scatterplot is a 2D reduction of the 5D data (6 groups of stats) for each microbenchmark. Each axis of the scatterplot is a principal component of the data. Clicking an axis renders a bar chart showing the constituent components that make up the principal component. Clicking the axis again hides the bar chart. It also times out after 10 seconds.

The scatterplot is colored by the group of parameters and every possible value for each parameter. The scatterplot is interactive, and hovering over a point shows the parameter and value for that point, while also highlighting all the points with the same parameter but different values. Zooming and panning is also enabled to allow for better viewing of the data. The legend is interactive, and can be viewed or hidden by clicking on the "Legend" button. Hovering over a legend item highlights all the points with the same parameter but different values.

On clicking on a point, a new visualization is opened. This visualization is a star chart, with each group of stats being arranged along the circumference of the circle. Each polygon is one particular value of the parameter. The polygon is colored by the value of the parameter. Hovering over a polygon shows the value of the parameter and the stats for that polygon, and the same behavior can be experienced by hovering over the star chart's legend.

The star chart's labels can be clicked, and clicking on them will render a star chart with a new view. This simulates the effect of drilling down, as we move from the overview view of all the stats of the parameter, to a specific stat, to a specific group of microbenchmarks, to, finally, a specific microbenchmark.

For the view associated with a specific group of microbenchmarks, the star chart also implements a feature where hovering over the label gives more information on what the microbenchmarks in that group do. This is done by showing a tooltip with the description of the microbenchmark, and the tooltip is hidden when the mouse leaves the label, and also has a timeout of 5 seconds as a fallback.

For the view associated with a specific microbenchmark, the star chart is replaced by a bar chart, which shows the particular stat for each value of the parameter for that microbenchmark. The bar chart has a hover effect, where hovering over a bar shows the stat for that bar. All the bars are of one color, since the values of the parameter are on the X-axis. There is also a checkbox below the bar chart, which allows the user to add a bar for the baseline value of that stat for that microbenchmark. This baseline stat is from the actual hardware, and is the value that we are trying to match. The checkbox can add or remove the baseline bar from the bar chart. In case the stat is not available for the baseline, the checkbox is disabled.

Animations and transitions are used to make the visualization more interactive and responsive. The scatterplot has a transition when the data is changed, and the star chart has a transition when the data is changed, and when the labels are clicked. The bar chart has a transition when the data is changed, and when the baseline bar is added or removed.

## Running the Visualization

The visualization can be run by navigating to the `ecs-272-fin` directory and running the following command:

``` bash
npm i
npm run dev
```

This will start a server on port 3000. The visualization can be viewed by navigating to `localhost:3000` in a browser. The visualization is best viewed in Mozilla Firefox in full screen mode of a Macbook Air 13" (1440x900 resolution).

## References

1. [Microbenchmarks](https://github.com/VerticalResearchGroup/microbench/tree/master)
2. [D3.js](https://d3js.org/)
3. [gem5](http://www.gem5.org/)
4. [PCA](https://www.sciencedirect.com/science/article/abs/pii/009830049390090R)
5. [Fine-tuning](https://www.gem5.org/assets/files/workshop-isca-2023/posters/validating-hardware-and-simpoints-with-gem5-poster.pdf)
