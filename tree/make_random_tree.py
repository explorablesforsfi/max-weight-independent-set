import json
from random import randint
import networkx as nx
import netwulf as wulf

def convert_to_digraph(_G):
    G = nx.DiGraph()
    G.add_nodes_from(_G.nodes())
    G.add_edges_from(list(sorted(edge) for edge in _G.edges()))

    weights = { n:randint(1,9) for n in G.nodes()}
    nx.set_node_attributes(G, weights, 'weight')

    return G



def deg_seq_tree(N):

    degree_sequence = [ randint(1,6) for i in range(N) ]

    if sum(degree_sequence) % 2 == 1:
        degree_sequence[0] += 1

    while len(degree_sequence)-sum(degree_sequence)//2 != 1:
        degree_sequence.append(0)
    _G = nx.degree_sequence_tree(degree_sequence)

    return _G

def random_powerlaw_tree(N):
    G = nx.random_powerlaw_tree(N,tries=10000)
    return G

def balanced(r,h):
    return nx.balanced_tree(r,h,nx.DiGraph)

def BA_tree(N):
    return nx.barabasi_albert_graph(N,1)

    

N = 20
#G = convert_to_digraph(random_powerlaw_tree(N))
G = convert_to_digraph(BA_tree(N))
#print(G.edges)
#wulf.visualize(nx.Graph(G))

# save in json
node_link_data = nx.tree_data(G,root=0)

with open('random_tree.json','w') as f:
    json.dump(node_link_data,f)
