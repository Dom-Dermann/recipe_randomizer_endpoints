import sys, getopt, time
import pymongo as mongo
import json
import pandas as pd
import numpy as np

uri = 'mongodb://admin:admin1!@ds026898.mlab.com:26898/recipe_randomizer'

def main(argv):
    argument = ''
    usage = 'usage: script.py -p <sometext>'
    
    # parse incoming arguments
    try:
        opts, args = getopt.getopt(argv,"hp:",["path="])
    except getopt.GetoptError:
        print(usage)
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print(usage)
            sys.exit()
        elif opt in ("-p", "--path"):
            argument = arg

    # test data output
    get_data()


def get_data():
    client = mongo.MongoClient(uri)
    db = client.get_database()
    recipes = db['recipes']

    cursor = recipes.find()

    df = pd.DataFrame(list(cursor))
    df.to_csv('./json_data.csv')
    random_recipe = df.sample(n=1, weights='rating', random_state=np.random.RandomState())
    json_recipe = random_recipe.to_json(orient='records', default_handler=str)
    print(json_recipe)

if __name__ == "__main__":
    main(sys.argv[1:])