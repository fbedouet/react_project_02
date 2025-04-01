import { useEffect, useRef, useState } from "react"
import { select, scaleLinear, extent, line, curveCatmullRom } from "d3"

/**
* 
* @param {{[key: string]:{kilogramm: number, calories: number}>}} activityData
* @returns React.RefObject<HTMLDivElement>
*/
export function AverageSessionDurationGph ({data}) {

    // Functions
    const drawCurve =(currentSvg, sessions, curveWidthInPourcent, paddingInPourcent)=> {
        if (!sessions) return
        
        const paddingInPixel = paddingInPourcent.map(size=> size/100*widthHeightSize)
        const curveWidthInPixel = curveWidthInPourcent / 100 * widthHeightSize

        const x = scaleLinear(
            [0, sessions.length-1],
            [paddingInPixel[3], widthHeightSize-paddingInPixel[1]]
        )

        const y = scaleLinear(
            extent(sessions),
            [widthHeightSize-paddingInPixel[2], paddingInPixel[0]]
        )

        currentSvg.append("path")
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", curveWidthInPixel)
            .attr("d", line()
            .x((_, i) => x(i))
            .y(d => y(d))
            .curve(curveCatmullRom.alpha(0.8))
            (sessions))
    }

    const drawDaysLabels =(currentSvg, labels, fontSizeInPourcent, paddingInPourcent)=> {
        const paddingInPixel = paddingInPourcent.map(size=> size/100*widthHeightSize)
        const fontSizeInPixel = fontSizeInPourcent/100*widthHeightSize

        const x = scaleLinear(
            [0, labels.length-1],
            [paddingInPixel[3], widthHeightSize-paddingInPixel[1]]
        )

        currentSvg.selectAll("days-labels")
            .data(labels)
            .join("text")
            .attr("x", (_,i)=> x(i) )
            .attr("y", widthHeightSize-paddingInPixel[2])
            .attr("font-size", `${fontSizeInPixel}px`)
            .attr("font-weight", "bold")
            .attr("fill", "white")
            .attr("text-anchor", "middle")
            .text(d=> `${d}`)
    }

    const drawTimeLayout =(currentSvg, sessions, fontSizeInPourcent, paddingInPourcent)=> {
        if (!sessions) return

        const paddingInPixel = paddingInPourcent.map(size=> size/100*widthHeightSize)
        const fontSizeInPixel = fontSizeInPourcent/100*widthHeightSize
        const pointSpacing = widthHeightSize / sessions.length
        let currentIndex=-1

        const x = scaleLinear(
            [0, sessions.length-1],
            [paddingInPixel[3], widthHeightSize-paddingInPixel[1]]
        )

        const y = scaleLinear(
            extent(sessions),
            [widthHeightSize-paddingInPixel[2], paddingInPixel[0]]
        )

        const drawLayout =()=> {
            currentSvg.insert("rect", ".mouse-tracker")
                .attr("class","timeLayout")
                .attr("height", widthHeightSize)
                .attr("x", x(currentIndex))
                .attr("width", widthHeightSize)
                .attr("fill", "#000000")
                .attr("fill-opacity", 0.15)
        }

        const displayTime =()=> {
            currentSvg.selectAll(".label-group").remove()

            currentSvg.selectAll("circle")
                .data(sessions)
                .join("circle")
                .attr("cx", x(currentIndex) )
                .attr("cy", y(sessions[currentIndex]))
                .attr("r", widthHeightSize*0.02)
                .attr("fill", "#FFFFFF")

            const group = currentSvg.append("g")
                .attr("class", "label-group")
                .attr("transform", `translate(${currentIndex !== 6 ? 10 : -10},0)`)

            const textElement = group.append("text")
                .text(`${sessions[currentIndex]} mn`)
                .attr("x", x(currentIndex))
                .attr("y", y(sessions[currentIndex]) - widthHeightSize * 0.05)
                .attr("fill", "black")
                .attr("font-size", `${fontSizeInPixel}px`)
                .attr("text-anchor", `${currentIndex !== 6 ? "start" : "end"}`)

            const bbox = textElement.node().getBBox()

            group.insert("rect", "text")
                .attr("x", bbox.x - 5)
                .attr("y", bbox.y - 2)
                .attr("width", bbox.width + 10)
                .attr("height", bbox.height + 4)
                .attr("fill", "#FFFFFF")
        }

        currentSvg.append("rect").raise()
            .attr("class", "mouse-tracker")
            .attr("width", widthHeightSize)
            .attr("height", widthHeightSize)
            .attr("fill", "transparent")
            .on("mousemove", (event) => {
                const index = Math.floor(event.offsetX / pointSpacing)
                if (currentIndex !== index){
                    currentIndex = index
                    if (currentIndex===7){currentIndex=6}
                    currentSvg.select(".timeLayout").remove()
                    drawLayout()
                    displayTime()
                }
            })
    }

    const drawTextInfo =(currentSvg, text, fontSizeInPourcent, paddingInPourcent)=> {
        const paddingInPixel = paddingInPourcent.map(size=> size / 100 * widthHeightSize)
        const fontSizeInPixel = fontSizeInPourcent / 100 * widthHeightSize

        currentSvg.selectAll("text-info")
            .data([null])
            .join("text")
            .attr("y", paddingInPixel[0])
            .attr("font-size", `${fontSizeInPixel}px`)
            .attr("fill", "white")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .selectAll("tspan")
                .data([
                    {text: `${text[0]}`},
                    {text: `${text[1]}`}
                ])
            .join("tspan")
            .attr("x", paddingInPixel[3] )
            .attr("dy", (_, i) => i === 0 ? 0 : "1.5em")
            .text((d)=> d.text )
    }
 
    // Hooks
    const svgRef = useRef (null)
    const [widthHeightSize, setWidthHeightSize] = useState(0)
     
    // SizeObserver
    useEffect( ()=> {

        const observer = new ResizeObserver ( entries=> {
            setWidthHeightSize(entries[0].contentRect.width)
        })

        observer.observe(svgRef.current)

        return () => observer.disconnect()
    },[])
 
    // Render
    useEffect( ()=> {
        if (!widthHeightSize) return

        const svg = select(svgRef.current)
            .selectAll("svg")
            .data([null])
            .join("svg")
            .attr("width", widthHeightSize)
            .style("background-color", "#FF0000")
            .classed("rounded-lg aspect-square", true)

        const _ = 'Not used'

        drawCurve(svg, data, .7, [40, 0, 20, 0])

        drawDaysLabels(svg, ["L", "M", "M", "J", "V", "S", "D"], 5, [_, 2, 8,2])

        drawTimeLayout(svg, data, 5, [40, 0, 20, 0])

        drawTextInfo(svg, ["Durée moyenne des", "sessions"], 5, [15 , _, _, 15])
            
        return () => {
            select(svgRef.current)
                .selectAll("circle, text, path, rect").remove()
        }
    },[widthHeightSize, data])
 
    return <>
        <div ref={svgRef} className="w-full overflow-auto">
        </div>
    </>
}