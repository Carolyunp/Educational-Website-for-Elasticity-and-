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

# Load Abaqus File
myMdb = "Mono_Stiffened_2.cae"  
mdb = openMdb(myMdb)

with open(r"D:\Temp\li_ht\input_v2_mono.txt") as f:
    content = f.readlines()
Section_1_thickness = float(content[0])
Section_2_thickness = float(content[1])
Stiffener_L_1 = float(content[2])
Stiffener_L_2 = float(content[3])
Stiffener_H = float(content[4])
Stiffener_theta = float(content[5])
Plate_W = float(content[6])
Plate_L = float(content[7])

# Parameters
original_values = {
    "Section_1_thickness": Section_1_thickness,
    "Section_2_thickness": Section_2_thickness,
    "Stiffener_L_1": Stiffener_L_1,
    "Stiffener_L_2": Stiffener_L_2,
    "Stiffener_H": Stiffener_H,
    "Stiffener_theta": Stiffener_theta,
    "Plate_W": Plate_W,
    "Plate_L": Plate_L
}

# Calculate +-5% variations
#def get_variations(value):
#    return [value * 0.95, value, value * 1.05]


# Modified model update
def update_model(params):
    mdb.models['Model-1'].sections['Section-1'].setValues(thickness=params["Section_1_thickness"])
    mdb.models['Model-1'].sections['Section-2'].setValues(thickness=params["Section_2_thickness"])
    #stiffener_sketch = mdb.models['Model-1'].parts['Stiffener'].features['Shell extrude-1'].sketch
    mdb.models['Model-1'].ConstrainedSketch(name='__edit__', objectToCopy=
        mdb.models['Model-1'].parts['Stiffener'].features['Shell extrude-1'].sketch)
    mdb.models['Model-1'].parts['Stiffener'].projectReferencesOntoSketch(filter=
        COPLANAR_EDGES, sketch=mdb.models['Model-1'].sketches['__edit__'], 
        upToFeature=
        mdb.models['Model-1'].parts['Stiffener'].features['Shell extrude-1'])
    mdb.models['Model-1'].sketches['__edit__'].parameters['Stiffener_L_1'].setValues(expression=str(params["Stiffener_L_1"]))
    mdb.models['Model-1'].sketches['__edit__'].parameters['Stiffener_L_2'].setValues(expression=str(params["Stiffener_L_2"]))
    mdb.models['Model-1'].sketches['__edit__'].parameters['Stiffener_H'].setValues(expression=str(params["Stiffener_H"]))
    mdb.models['Model-1'].sketches['__edit__'].parameters['Stiffener_theta'].setValues(expression=str(params["Stiffener_theta"]))
    mdb.models['Model-1'].ConstrainedSketch(name='__edit__', objectToCopy=
        mdb.models['Model-1'].parts['Plate'].features['Shell planar-1'].sketch)
    mdb.models['Model-1'].parts['Plate'].projectReferencesOntoSketch(filter=
        COPLANAR_EDGES, sketch=mdb.models['Model-1'].sketches['__edit__'], 
        upToFeature=
        mdb.models['Model-1'].parts['Plate'].features['Shell planar-1'])
    mdb.models['Model-1'].sketches['__edit__'].parameters['Plate_W'].setValues(expression=str(params["Plate_W"]))
    mdb.models['Model-1'].sketches['__edit__'].parameters['Plate_L'].setValues(expression=str(params["Plate_L"]))
    # Extrusion
    mdb.models['Model-1'].parts['Stiffener'].features['Shell extrude-1'].setValues(
        depth=Plate_L  
    )
    mdb.models['Model-1'].parts['Stiffener'].regenerate()

    # Regenerate mesh
    mdb.models['Model-1'].parts['Plate'].generateMesh()
    mdb.models['Model-1'].parts['Stiffener'].generateMesh()
    mdb.models['Model-1'].parts['Stiffener'].regenerate()
    mdb.models['Model-1'].parts['Plate'].regenerate()
    mdb.models['Model-1'].rootAssembly.regenerate()
    
    # assign offset    
    #mdb.models['Model-1'].rootAssembly.translate(instanceList=('Stiffener-1', ), 
       #vector=(0.0, (Section_1_thickness + Section_2_thickness) / 2, 0.0))
    mdb.models['Model-1'].rootAssembly.translate(instanceList=('Plate-1', ), 
        vector=(0.0, -(Section_1_thickness + Section_2_thickness) / 2, 0.0))
    mdb.models['Model-1'].rootAssembly.regenerate()
    
print('it works')


 

 #Submit Jobs
params = original_values.copy()
update_model(params)

mdb.Job(atTime=None, contactPrint=OFF, description='', echoPrint=OFF,
        explicitPrecision=SINGLE, getMemoryFromAnalysis=True, historyPrint=OFF,
        memory=90, memoryUnits=PERCENTAGE, model='Model-1', modelPrint=OFF,
        multiprocessingMode=DEFAULT, name='Job_Stiffened', nodalOutputPrecision=SINGLE,
        numCpus=1, numGPUs=0, queue=None, resultsFormat=ODB, scratch='', type=ANALYSIS,
        userSubroutine='', waitHours=0, waitMinutes=0)
mdb.jobs['Job_Stiffened'].writeInput()
mdb.jobs['Job_Stiffened'].submit(consistencyChecking=OFF)
mdb.jobs['Job_Stiffened'].waitForCompletion()

odb = openOdb(path='Job_Stiffened.odb')
STEP = odb.steps.values()[0]
ModeEigenValue = []
stei = 0


for i_frame in STEP.frames:
    print
    i_frame.description
    if stei == 1:
        f1 = i_frame.description
        MinEigen = float(f1.split('EigenValue = ')[1].split()[0])
    stei = stei + 1

file_output = open(r"D:\Temp\li_ht\output_v2_mono.txt", 'w')
file_output.write(str(MinEigen))
file_output.close()

# Loop for variations
# job_counter = 1
# for param in original_values.keys():
   # for value in variations[param][:1] + variations[param][2:]:
       # job_counter += 1
       # params = original_values.copy()
       # params[param] = value
        
       # update_model(params)
        
       # job_name = f"Job_Stiffened_{job_counter}"
       # mdb.Job(atTime=None, contactPrint=OFF, description='', echoPrint=OFF,
               # explicitPrecision=SINGLE, getMemoryFromAnalysis=True, historyPrint=OFF,
               # memory=90, memoryUnits=PERCENTAGE, model='Model-1', modelPrint=OFF,
               # multiprocessingMode=DEFAULT, name=job_name, nodalOutputPrecision=SINGLE,
               # numCpus=1, numGPUs=0, queue=None, resultsFormat=ODB, scratch='', type=ANALYSIS,
               # userSubroutine='', waitHours=0, waitMinutes=0)
       # mdb.jobs[job
        
       # file_output = open(r"D:\Temp\li_ht\output_v1.txt", 'w')
# file_output.write(str(MinEigen))
# file_output.close()

mdb.models['Model-1'].rootAssembly.translate(instanceList=('Plate-1', ), vector=(0.0, (Section_1_thickness + Section_2_thickness) / 2, 0.0))
