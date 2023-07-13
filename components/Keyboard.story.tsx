import { Keyboard } from "./Keyboard"

export default {title: "Keyboard"}
export const Default = () => {
    return (
        <Keyboard correctChar={[]} imputedChar={[]} onClick={()=>{}}/>
    )
}
export const FullFalse = () => {
    return (
        <Keyboard correctChar={'FULLFALSE'.split('')} imputedChar={'ZPQOI'.split('')} onClick={()=>{}}/>
    )
}
export const FullTrue = () => {
    return (
        <Keyboard correctChar={"FULLTRUE".split("")} imputedChar={"FULLTRUE".split("")} onClick={()=>{}}/>
    )
}
export const FullTralse = () => {
    return (
        <Keyboard correctChar={"THISISCORRECT".split("")} imputedChar={"THATISFALSE".split("")} onClick={()=>{}}/>
    )
}