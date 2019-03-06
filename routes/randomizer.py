import sys, getopt, time
import pymongo as mongo
import json
import pandas as pd
import numpy as np

uri = 'mongodb://admin:admin1!@ds026898.mlab.com:26898/recipe_randomizer'
max_cooked = 0

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

    global max_cooked
    max_cooked_local = df.loc[df['timesCooked'].idxmax()]
    max_cooked = max_cooked_local.timesCooked

    df['timesCookedNegative'] = df['timesCooked'].apply(adjust_cooked)
    df['percentRating'] = df['rating'].apply(adjust_rating)
    df['percentTimesCooked'] = df['timesCookedNegative'].apply(adjust_cookedPercent)
    df['weightedRating'] = df.percentRating * df.percentTimesCooked

    df.to_csv('./json_data.csv')
    random_recipe = df.sample(n=1, weights='weightedRating', random_state=np.random.RandomState())
    json_recipe = random_recipe.to_json(orient='records', default_handler=str)
    print(json_recipe)

def adjust_cooked(row):
    # todo: determine highest value, instead of hard coded 25
    row -= max_cooked
    row = abs(row)
    return row

def adjust_rating(row):
    # five is the highest rating the API allows for. Therefore, 5 can be hard-coded here
    percent = row / 5
    return percent

def adjust_cookedPercent(row):
    percent = row / max_cooked
    return percent

if __name__ == "__main__":
    main(sys.argv[1:])