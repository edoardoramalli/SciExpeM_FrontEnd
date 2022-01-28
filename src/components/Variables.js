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
const reactor_modes = ['counterflow', 'premixed', 'coflow']

const ignition_type = ['max','d/dt max','baseline max intercept from d/dt','baseline min intercept from d/dt','concentration', 'relative concentration']
const ignition_quantity = ['T', 'p', 'OH', 'CH', 'CO2']

export const colorScale = [
    [0, "rgb(165,0,38)"],
    [0.1, "rgb(215,48,39)"],
    [0.2, "rgb(244,109,67)"],
    [0.3, "rgb(253,174,97)"],
    [0.4, "rgb(254,224,139)"],
    [0.5, "rgb(255,255,191)"],
    [0.6, "rgb(217,239,139)"],
    [0.7, "rgb(166,217,106)"],
    [0.8, "rgb(102,189,99)"],
    [0.9, "rgb(26,152,80)"],
    [1, "rgb(0,104,55)"]]


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

export default {reactors, experimentTypeToReactor, ignition_type, ignition_quantity, ignition, reactor_modes, colorScale}