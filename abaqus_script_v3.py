from abaqus import *
from abaqusConstants import *
import __main__
import section
import regionToolset
import displayGroupMdbToolset as dgm
import part
import material
import assembly
import step
import interaction
import load
import mesh
import job
import sketch
import visualization
import xyPlot
import displayGroupOdbToolset as dgo
import connectorBehavior
from abaqus import *
from part import *
from material import *
from section import *
from assembly import *
from step import *
from interaction import *
from load import *
from mesh import *
from optimization import *
from job import *
from sketch import *
from visualization import *
from connectorBehavior import *
from odbAccess import *
import job
import sys
import os

import numpy as np

myMdb = 'Plate2.cae'
mdb = openMdb(myMdb) #Load .cae file

print()
print()
print()

#######################################################################################
with open(r"D:\Temp\l_morse\Abaqus\MECH0020 Flat Plate Hole\input_v1.txt") as f:
    content = f.readlines()
MyWidth = int(content[0])
MyRadius = int(content[1])
MyThickness = float(content[2])

#MyWidth = 100
#MyRadius = 20
#MyThickness = 5.0

print('Width:   ',MyWidth)
print('Radius:   ',MyRadius)
print('Thickness:   ',MyThickness)

#######################################################################################
# print(mdb.models['Model-1'].parts['Part-1'].features['Shell planar-1'].sketch)
# print(mdb.models['Model-1'].parts['Part-1'].features['Shell planar-1'])
# print(mdb.models['Model-1'].sketches)

# Change width of plate to MyWidth and radius of hole to MyRadius
mdb.models['Model-1'].ConstrainedSketch(name='__edit__', objectToCopy=
    mdb.models['Model-1'].parts['Part-1'].features['Shell planar-1'].sketch)
mdb.models['Model-1'].parts['Part-1'].projectReferencesOntoSketch(filter=
    COPLANAR_EDGES, sketch=mdb.models['Model-1'].sketches['__edit__'], 
    upToFeature=
    mdb.models['Model-1'].parts['Part-1'].features['Shell planar-1'])
mdb.models['Model-1'].sketches['__edit__'].parameters['W'].setValues(
    expression=str(MyWidth))
mdb.models['Model-1'].sketches['__edit__'].parameters['R'].setValues(
    expression=str(MyRadius))
mdb.models['Model-1'].parts['Part-1'].features['Shell planar-1'].setValues(
    sketch=mdb.models['Model-1'].sketches['__edit__'])
del mdb.models['Model-1'].sketches['__edit__']
mdb.models['Model-1'].parts['Part-1'].regenerate()



# Regenerate mesh
mdb.models['Model-1'].parts['Part-1'].generateMesh()

# Regenerate the model (tells Abaqus that the width and radius have been changed)
mdb.models['Model-1'].parts['Part-1'].regenerate()
mdb.models['Model-1'].rootAssembly.regenerate()


#######################################################################################
# Change thickness of plate to MyThickness
mdb.models['Model-1'].sections['Section-1'].setValues(thickness=MyThickness)
# print('Thickness:   ',mdb.models['Model-1'].sections['Section-1'].thickness)

# Regenerate the model (tells Abaqus that the thickness has been changed)
mdb.models['Model-1'].parts['Part-1'].regenerate()
mdb.models['Model-1'].rootAssembly.regenerate()


#######################################################################################
# Run job and create ODB file
print('Running job')
mdb.Job(atTime=None, contactPrint=OFF, description='', echoPrint=OFF,
        explicitPrecision=SINGLE, getMemoryFromAnalysis=True, historyPrint=OFF,
        memory=90, memoryUnits=PERCENTAGE, model='Model-1', modelPrint=OFF,
        multiprocessingMode=DEFAULT, name='Job-1', nodalOutputPrecision=SINGLE,
        numCpus=1, numGPUs=0, queue=None, resultsFormat=ODB, scratch='', type=
        ANALYSIS, userSubroutine='', waitHours=0, waitMinutes=0)
mdb.jobs['Job-1'].writeInput()
mdb.jobs['Job-1'].submit(consistencyChecking=OFF)
mdb.jobs['Job-1'].waitForCompletion()
print('Completed job')

# Extract stress from ODB file
odb = openOdb(path='Job-1.odb')
STEP = odb.steps.values()[0]
#print(STEP.frames[1].fieldOutputs['S'].values[0].mises)
StepValues=STEP.frames[1].fieldOutputs['S']

j=0
VonMises=[]
for i in StepValues.values:
    VonMises.append(i.mises)
# print(VonMises)

VonMises_Max=max(VonMises)
print('Max Von Mises:   ',VonMises_Max)

odb.close()


file_output = open(r"D:\Temp\l_morse\Abaqus\MECH0020 Flat Plate Hole\output_v1.txt", 'w')
file_output.write(str(VonMises_Max))
file_output.close()