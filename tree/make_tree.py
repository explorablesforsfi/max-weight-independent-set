import json
import networkx as nx

G = nx.DiGraph()
G.add_nodes_from(range(8))
weights = { 0:4, 1:7, 2:8, 3:4, 4:5, 5:6, 6:1, 7:2}
nx.set_node_attributes(G, weights, 'weight')

edges = [
            (0,1),
            (0,2),
            (2,4),
            (4,6),
            (4,7),
            (1,3),
            (1,5),
        ]

G.add_edges_from(edges)

# save in json
node_link_data = nx.tree_data(G,root=0)

with open('tree.json','w') as f:
    json.dump(node_link_data,f)
