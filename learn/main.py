avg=0
with open ('learn/text.txt','r') as f:
    for content in f:
     
        parts=content.strip().split(',')
        print(content)
        avg+=int(parts[2])

        
        
print(f'avg={avg/3}')
