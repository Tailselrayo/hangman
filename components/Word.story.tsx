import { Word } from "./Word"

export default {
    component: Word,
    title: "Word"
}
export const Default = () => {
    return (
        <Word word={"Change"} imputedChara={[]} hint={false}/>
    )
}
export const Partial = () => {
    return (
        <Word word={"Change"} imputedChara={["C","A",'G', "E"]} hint={false}/>
    )
}
export const Hint = () => {
    return (
        <Word word={"Change"} imputedChara={[]} hint={true}/>
    )
}
export const Complete = () => {
    return (
        <Word word={"Change"} imputedChara={["C","A",'G',"N", "H", "E"]} hint={false}/>
    )
}
export const PartialHint = () => {
    return (
        <Word word={"Anticonstitutionnellement"} imputedChara={["I"]} hint={true}/>
    )
}
