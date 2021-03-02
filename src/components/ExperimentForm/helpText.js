import React from 'react';
export const text =
<div>
    <h2> Upload an .xlsx file following this structure</h2>
    <p> Each column is composed by an header and the scalar values:<br/>
        The header defines the property name and the unit of measurement, the scalar values the measured
        quantity.<br/>
        Under each column header the corresponding scalar values of the property.</p>
    <p><b>Column header:</b> property_name [unit]</p>
    <p><b>Property names:</b>
        <ul>
            <li><i>temperature </i>[K]</li>
            <li><i>pressure </i>[Pa | kPa | MPa | Torr | torr | bar | mbar | atm]</li>
            <li><i>volume </i>[m3 | dm3 | cm3 | mm3 | L]</li>
            <li><i>time </i>[s | ms | us | ns | min]</li>
            <li><i>residence time </i>[s | ms | us | ns | min]</li>
            <li><i>distance </i>[m | dm | cm | mm]</li>
            <li><i>ignition delay </i>[s | ms | us | ns | min]</li>
            <li><i>rate coefficient </i>[s-1 | m3 mol-1 s-1 | dm3 mol-1 s-1 | cm3 mol-1 s-1 | m3
                molecule-1 s-1 | dm3 molecule-1 s-1 | cm3 molecule-1 s-1 | m6 mol-3 s-1 | dm6 mol-2 s-1
                | cm6 mol-2 s-1 | m6 molecule-2 s-1 | dm6 molecule-2 s-1 | cm6 molecule-2 s-1]
            </li>
            <li><i>equivalence ratio </i></li>
            <li><i>length </i>[m | dm | cm | mm]</li>
            <li><i>density </i>[g m-3 | g dm-3 | g cm-3 | g mm-3 | kg m-3 | kg dm-3 | kg cm-3 | kg mm-3]
            </li>
            <li><i>flow rate </i>[g m-2x s-1 | g dm-2 s-1 | g cm-2 s-1 | g mm-2 s-1 | kg m-2 s-1 | kg
                dm-2 s-1 | kg cm-2 s-1 | kg mm-2 s-1]
            </li>
            <li><i>laminar burning velocity </i>[m/s | dm/s | cm/s | mm/s | m s-1 | dm s-1 | cm s-1 | mm
                s-1]
            </li>
            <li><i>initial composition </i></li>
            <li><i>composition </i>[mole fraction | percent | ppm | ppb]</li>
            <li><i>concentration </i>[mol/m3 | mol/dm3 | mol/cm3 | mol m-3 | mol dm-3 | mol cm-3 |
                molecule/m3 | molecule/dm3 | molecule/cm3 | molecule m-3 | molecule dm-3 | molecule
                cm-3]
            </li>
            <li><i>uncertainty </i></li>
        </ul>
    </p>
</div>;