# Maximum Weight Independent Set

Try finding a set of nodes which are not connected and whose cumulative scores are maximal.

## Run

First, clone this repository

    git clone https://github.com/explorablesforsfi/max-weight-independent-set.git

Then change to the created directory and start a local webserver

    cd max-weight-independent-set
    python -m "http.server" 1313
    
Go to your browser and navigate to http://localhost:1313 .

![max-weight-independent-set](https://github.com/explorablesforsfi/max-weight-independent-set/raw/master/img/example.png)

## Modify

Add your own tree as a json-file and load it in `index_html` as `graph_url = './path/to/tree.js'`. This file must be of the following structure:

```json
{
    "children": [
        {
            "children": [
                {
                    "id": 3,
                    "weight": 4
                },
                {
                    "id": 5,
                    "weight": 6
                }
            ],
            "id": 1,
            "weight": 7
        },
        {
            "children": [
                {
                    "children": [
                        {
                            "id": 6,
                            "weight": 1
                        },
                        {
                            "id": 7,
                            "weight": 2
                        }
                    ],
                    "id": 4,
                    "weight": 5
                }
            ],
            "id": 2,
            "weight": 8
        }
    ],
    "id": 0,
    "weight": 4
}
```

## License

All original code in this repository, i.e. all code which is not in the subdirectory `/libs/` is licensed under the CC 4.0 licence. The subdirectory `/libs/` contains external libraries which are licensed as follows

 
| File name                      | License                                 | Link to repository|
|--------------------------------|-----------------------------------------|-------------------|
| `d3.v5.min.js`                 | BSD 3-Clause "New" or "Revised" License | [d3](https://github.com/d3/d3)|
| `widget.v3.4.js`               | permission to use given by D. Brockmann | [complexity explorables](http://www.complexity-explorables.org) |
