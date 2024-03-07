from neo4j import GraphDatabase

class Connection:
    def __init__(self):
        uri = "bolt://localhost:7687"
        user = "neo4j"
        password = "123456"
        self.driver = GraphDatabase.driver(uri,auth=(user, password))


    def close(self):
        self.driver.close()
