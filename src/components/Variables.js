const reactors = ['shock tube', 'stirred reactor', 'flow reactor', 'flame', 'rapid compression machine']
const experimentTypeToReactor = {
    'ignition delay measurement': ['shock tube', 'rapid compression machine'],
    'laminar burning velocity measurement': ['flame'],
    'outlet concentration measurement': ['shock tube','stirred reactor','flow reactor'],
    'concentration time profile measurement': ['shock tube','stirred reactor','flow reactor'],
    'jet stirred reactor measurement': ['shock tube','stirred reactor','flow reactor'],
    'burner stabilized flame speciation measurement': ['flame'],
    'direct rate coefficient measurement': ['shock tube','stirred reactor','flow reactor'],
}

export default {reactors, experimentTypeToReactor}