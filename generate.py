import os
import itertools
import json

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
	return {"type": "image", "name": jpeg, "url": "images/" + toPng(jpeg)}

def writeTo(counter):
	import io
	counter = counter+1
	return io.FileIO(outputdirectory() + "/archive" + str(counter) + ".json", "w")
	
def convertJpeg(jpeg):
	import subprocess
	subprocess.check_call("gm convert " + inputdirectory() + "/" + jpeg + " -thumbnail 25600@ " + inputdirectory() + "/" + toPng(jpeg), shell=True)

files = os.listdir(inputdirectory())
jpegs = [f for f in files if f.endswith(".jpg")]

jpegs = sorted(jpegs, key=date)
for jpeg in jpegs:
	convertJpeg(jpeg)

count = 0
for group, grouped_jpegs in itertools.groupby(jpegs, date):
	json.dump(
		{
			"data": [format(jpeg) for jpeg in list(grouped_jpegs)],
			"group": group
		},
		writeTo(count)
	)
	count = count + 1