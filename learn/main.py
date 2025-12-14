avg=0
with open ('learn/text.txt','r') as f:
    for line in f:
        f.seek(16)
        content=f.read()
        avg+=content

        
        print(content)
print(avg)
