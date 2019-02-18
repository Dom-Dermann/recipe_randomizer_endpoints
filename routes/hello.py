import sys, getopt, time

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

    # print output
    print('You gave me: {}'.format(argument))

if __name__ == "__main__":
    main(sys.argv[1:])