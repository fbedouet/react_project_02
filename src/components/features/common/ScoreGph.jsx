import { useEffect, useRef, useState } from "react"
import { select, easeCubicInOut, interpolate, interpolateNumber } from "d3"

export function ScoreGph ({score}){
    
    // Functions
    const displayScore =(svg, prevScoreRef, score, radius)=> {
        const cx = widthDimension/2
        const cy = widthDimension/2
        const prevScore = prevScoreRef.current ?? 0
        prevScoreRef.current = score
        
        svg
            .selectAll(".scoreUser")
                .data([score])
                .join('path').raise()
                .attr("class", "scoreUser")
                .attr("transform", `rotate(-30, ${cx}, ${cy})`)
                .transition().duration(1000).ease(easeCubicInOut)
                .attr('fill', 'none')
                .attr('stroke','red')
                .attr('stroke-linecap', 'round')
                .attrTween("d", (d)=> {
                    const startAngle = interpolateNumber (0, 240 * prevScore * (Math.PI / 180))
                    const endAngle = interpolateNumber(0, 240 * d * (Math.PI / 180))
                    return (t)=> {
                        const r = radius; // Rayon
                        const currentAngle = startAngle(1 - t) + endAngle(t)
                        const startX = cx - r * Math.cos(0);
                        const startY = cy - r * Math.sin(0);
                        const endX = cx - r * Math.cos(currentAngle);
                        const endY = cy - r * Math.sin(currentAngle);
                        const largeArcFlag = currentAngle > Math.PI ? 1 : 0;
                        return`
                            M ${startX},${startY}
                            A ${r},${r} 0 ${largeArcFlag},1 ${endX},${endY}
                        `
                    }
                })
                .attr('stroke-width', widthDimension/2*0.07)

    }

    const displayCircle =(svg, radius)=> {
        const cx = widthDimension/2
        const cy = widthDimension/2

        svg.selectAll()
            .data([null])
            .join("circle")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", radius)
            .attr("fill", "white")
        
    }

    const displayText =(svg, score)=> {
        const cx = widthDimension/2
        const cy = widthDimension/2
        const fontSize = widthDimension / 15
        svg.selectAll()
            .data([score])
            .join("text")
            .attr("y",cy)
            .attr("text-anchor", "middle")
            .selectAll("tspan")
            .data([
                {text: (d)=>`${d*100}%`, color: "black", weight: "bold", size: `${fontSize*1.6}px`},
                {text: ()=>"de votre", color:"#74798C", weight:"medium", size: `${fontSize}px`},
                {text: ()=>"objectif", color: "#74798C", weight: "medium", size: `${fontSize}px`}
            ])
            .join("tspan")
            .attr("x", cx)
            .attr("dy", (d, i) => i === 0 ? 0 : "1.5em")
            .attr("fill", (d)=>d.color)
            .style("font-weight", (d)=>d.weight)
            .style("font-size", (d)=> d.size)
            .text((d, i, nodes) => {
                const dataValue = score
                return typeof d.text === "function" ? d.text(dataValue) : d.text;
            })
    }

    const displayTitle =(svg)=> {
        const cx = widthDimension/8
        const cy = widthDimension/7
        const fontSize = widthDimension / 18

        svg
        .selectAll()
        .data([null])
        .join("text")
        .attr("x", cx)
        .attr("y", cy)
        .text("Score")
        .style("font-weight", "bold")
        .style("font-size", `${fontSize}px`)
    }

    // Hooks
    const svgRef = useRef (null)
    const prevScoreRef = useRef (null)
    const [widthDimension, setWidthDimension] = useState(0)
    
    // SizeObserver
    useEffect( ()=> {
        const observer = new ResizeObserver ( entries=> {
            setWidthDimension(entries[0].contentRect.width)
        } )

        observer.observe(svgRef.current)

        return () => observer.disconnect()
    },[])

    // Render
    useEffect( ()=> {
        if (!widthDimension) return

        const radius = widthDimension/2*0.65

        const svg = select(svgRef.current)
            .selectAll("svg")
            .data([null])
            .join("svg")
            .attr("width", widthDimension)
            .style("background-color", "#F8F8F8")
            .classed("rounded-lg aspect-square",true)
            
            displayCircle(svg, radius)
            displayScore(svg, prevScoreRef, score, radius)
            displayText(svg, score)
            displayTitle(svg)
            return () => {
                select(svgRef.current)
                    .selectAll("circle, text").remove()
            }
    },[widthDimension, score])

    return <>
        <div ref={svgRef} className="w-full overflow-auto">
        </div>
    </>
}