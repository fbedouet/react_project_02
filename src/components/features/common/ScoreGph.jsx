import { useEffect, useRef, useState } from "react"
import { select, easeCubicInOut, interpolateNumber } from "d3"

export function ScoreGph ({score}){
    
    // Functions
    const displayArcGraphScore =(currentSvg, scoreValue, radius, arcWidthInPourcent)=> {
        const cx = widthHeightSize/2
        const cy = widthHeightSize/2
        const arcWidthInPixel = arcWidthInPourcent / 100 * widthHeightSize
        const prevScore = prevScoreRef.current ?? 0

        prevScoreRef.current = scoreValue
        
        currentSvg.selectAll(".scoreUser")
            .data([scoreValue])
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
            .attr('stroke-width', arcWidthInPixel)
    }

    const displayCircleBackground =(currentSvg, radius)=> {
        const cx = widthHeightSize/2
        const cy = widthHeightSize/2

        currentSvg.selectAll()
            .data([null])
            .join("circle")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", radius)
            .attr("fill", "white")
    }

    const displayText =(currentSvg, scoreValue, text, scoreFontSizeInPourcent, fontSizeInPourcent, paddingInPourcent)=> {
        const x = widthHeightSize/2
        const fontSizeInPixel = fontSizeInPourcent / 100 * widthHeightSize
        const scoreFontSizeInPixel = scoreFontSizeInPourcent / 100 * widthHeightSize
        const paddingInPixel = paddingInPourcent.map(size=> size / 100 * widthHeightSize)

        currentSvg.selectAll()
            .data([score])
            .join("text")
            .attr("y",paddingInPixel[0])
            .attr("text-anchor", "middle")
            .selectAll("tspan")
                .data([
                    {text: (d)=>`${d*100}%`, color: "black", weight: "bold", size: `${scoreFontSizeInPixel}px`},
                    {text: ()=>`${text[0]}`, color:"#74798C", weight:"bold", size: `${fontSizeInPixel}px`},
                    {text: ()=>`${text[1]}`, color: "#74798C", weight: "bold", size: `${fontSizeInPixel}px`}
                ])
                .join("tspan")
                .attr("x", x)
                .attr("dy", (_, i) => i === 0 ? 0 : "1.5em")
                .attr("fill", (d)=>d.color)
                .style("font-weight", (d)=>d.weight)
                .style("font-size", (d)=> d.size)
                .text((d) => {
                    const dataValue = scoreValue
                    return typeof d.text === "function" ? d.text(dataValue) : d.text;
                })
    }

    const displayTitle =(currentSvg, text, fontSizeInPourcent, paddingInPourcent)=> {
        const fontSizeInPixel = fontSizeInPourcent / 100 * widthHeightSize
        const paddingInPixel = paddingInPourcent.map(size=> size / 100 * widthHeightSize)

        currentSvg.selectAll()
            .data([null])
            .join("text")
            .attr("x", paddingInPixel[3])
            .attr("y", paddingInPixel[0])
            .text(`${text}`)
            .style("font-weight", "bold")
            .style("font-size", `${fontSizeInPixel}px`)
    }

    // Hooks
    const svgRef = useRef (null)
    const prevScoreRef = useRef (null)
    const [widthHeightSize, setwidthHeightSize] = useState(0)
    
    // SizeObserver
    useEffect( ()=> {
        const observer = new ResizeObserver ( entries=> {
            setwidthHeightSize(entries[0].contentRect.width)
        } )

        observer.observe(svgRef.current)

        return () => observer.disconnect()
    },[])

    // Render
    useEffect( ()=> {
        if (!widthHeightSize) return

        const circleGraphRadius = widthHeightSize/2*0.65

        const svg = select(svgRef.current)
            .selectAll("svg")
            .data([null])
            .join("svg")
            .attr("width", widthHeightSize)
            .style("background-color", "#F8F8F8")
            .classed("rounded-lg aspect-square", true)

        const _ = 'Not used'
            
        displayCircleBackground(svg, circleGraphRadius)

        displayArcGraphScore(svg, score, circleGraphRadius, 4)

        displayText(svg, score, ["de votre", "objectif"], 11, 6, [50, _, _, _])

        displayTitle(svg, "Score", 6, [20, _, _, 5])

        return () => {
            select(svgRef.current)
                .selectAll("circle, text").remove()
        }
    },[widthHeightSize, score])

    return <>
        <div ref={svgRef} className="w-full overflow-auto">
        </div>
    </>
}