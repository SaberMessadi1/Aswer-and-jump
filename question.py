config=[]
import pickle 
quest=dict()
while(True) :
    quest["level"]=input('donner level')
    quest["theme"]=input('donner theme ')
    quest["question"]=input('donner la question')
    l=[]
    for i in range(4) :
        l.append(input('donner les reponses'))
    quest["answers"]=l
    quest["correct"]=input("donner la correcte reponse")
    config.append(quest)
    a=input("tapez o si vous voulez ajouter une autre question sinon tapez n")
    with open("data.txt", "wb") as question :
        pickle.dump(config,question)
    if (a=="n") :
        break
with open ('data.txt', 'rb') as temp:
    items = pickle.load(temp)
