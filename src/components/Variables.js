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

const ignition_type = ['max','d/dt max','baseline max intercept from d/dt','baseline min intercept from d/dt','concentration', 'relative concentration']
const ignition_quantity = ['T', 'p', 'OH', 'CH', 'CO2']


function create_ignition(){
    let tmp = []
    ignition_quantity.map((item)=>{
        ignition_type.map((item2) =>{
            tmp.push(item + '-' + item2)
        })
    })
    tmp = [undefined, ...tmp]
    return tmp
}

const ignition = create_ignition()

export default {reactors, experimentTypeToReactor, ignition_type, ignition_quantity, ignition}