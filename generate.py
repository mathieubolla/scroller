import os
import itertools

def inputdirectory():
	import sys
	return sys.argv[1]

def outputdirectory():
	import sys
	return sys.argv[2]

def date(file):
	return file[:10]

def toPng(jpeg):
	return jpeg[0:len(jpeg)-3]+"png"

def format(jpeg):
	return {"type": "image", "name": "images/" + jpeg, "url": "images/" + toPng(jpeg)}

def writeTo(counter):
	import io
	counter = counter+1
	return io.FileIO(outputdirectory() + "/archive" + str(counter) + ".json", "w")
	
def convertJpeg(jpeg):
	import subprocess
	subprocess.check_call("gm convert " + inputdirectory() + "/" + jpeg + " -thumbnail 25600@ " + inputdirectory() + "/" + toPng(jpeg), shell=True)

def outputList(jpegs, groupName, id):
	import json
	json.dump(
		{
			"data": [format(jpeg) for jpeg in jpegs],
			"group": groupName
		},
		writeTo(id)
	)

jpegs = sorted([f for f in os.listdir(inputdirectory()) if f.endswith(".jpg")], key=date)
for jpeg in jpegs:
	convertJpeg(jpeg)

count, image_count = 0, 0
for group, grouped_jpegs in itertools.groupby(jpegs, date):
	grouped_jpegs_list = list(grouped_jpegs)
	outputList(grouped_jpegs_list, group, count)
	count = count + 1
	image_count = image_count + len(grouped_jpegs_list)
	if (count % 10) == 0:
		print "Processed "+str(count)+" groups with "+str(image_count)+" images."