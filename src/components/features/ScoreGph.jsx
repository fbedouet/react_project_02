import { useEffect, useRef } from "react"
import { select } from "d3"

export function ScoreGph({score}){

    const svgRef = useRef(null)
    useEffect( ()=> {
        const data = [score]
        const width = 260
        const height = 260

        const svg = select(svgRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("background-color", "#F8F8F8")
            .classed("rounded-lg",true)

        {svg.selectAll()
            .data(data)
            .join("circle")
            .attr("cx", 130)
            .attr("cy", 130)
            .attr("r",80)
            .attr("fill", "white")
        }

        {svg.selectAll()
            .data(data)
            .join('path')
            .attr("d", (d)=> {
                const r = 80; // Rayon
                const cx = 130; // Centre x
                const cy = 130; // Centre y
                const endAngle = 240 * d * (Math.PI / 180)
                const startX = cx - r * Math.cos(0);
                const startY = cy - r * Math.sin(0);
                const endX = cx - r * Math.cos(endAngle);
                const endY = cy - r * Math.sin(endAngle);
                const largeArcFlag = endAngle > Math.PI ? 1 : 0;
                return`
                M ${startX},${startY}
                A ${r},${r} 0 ${largeArcFlag},1 ${endX},${endY}
                `
            })
            .attr('fill', 'none')
            .attr('stroke','red')
            .attr('stroke-width', 10)
            .attr('stroke-linecap', 'round')
            .attr("transform", "rotate(-30, 130, 130)")
        }

        {svg.selectAll()
            .data(data)
            .join("text")
            .attr("y",130)
            .attr("text-anchor", "middle")
            .selectAll("tspan")
            .data([
                {text: (d)=>`${d*100}%`, color: "black", weight: "bold", size: "26px"},
                {text: ()=>"de votre", color:"#74798C", weight:"medium", size: "16px"},
                {text: ()=>"objectif", color: "#74798C", weight: "medium", size: "16px"}
            ])
            .join("tspan")
            .attr("x", 130)
            .attr("dy", (d, i) => i === 0 ? 0 : "1.9em")
            .attr("fill", (d)=>d.color)
            .style("font-weight", (d)=>d.weight)
            .style("font-size", (d)=> d.size)
            .text((d, i, nodes) => {
                const dataValue = data[0]
                return typeof d.text === "function" ? d.text(dataValue) : d.text;
            })
        }

        return () => {
            select(svgRef.current).selectAll("*").remove()
        }
    
    },[score])


    return <div ref={svgRef}></div>
}