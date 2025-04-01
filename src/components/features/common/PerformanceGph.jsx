import { useEffect, useRef, useState } from "react";
import { scaleLinear, select, easeCubicInOut } from "d3"

export function PerformanceGph({data, language, order=[1, 2, 3, 4, 5, 6]}){

    // Functions
    const getCoordinates =(radius, currentAxis)=> {
        const angle = 2*Math.PI / 6
        const cx = widthHeightSize/2
        const cy = widthHeightSize/2
        const endX = cx - radius * Math.cos(angle*currentAxis+Math.PI/2)
        const endY = cy - radius * Math.sin(angle*currentAxis+Math.PI/2)
        return`${endX},${endY}`
    }

    const displayPerfUser =(currentSvg, data, scale)=> {
        
        const polygonCoordinates =(data, scale)=> {
            const coordinates = []
            const userData = Array.from({length:data.length}, (_,index)=> {
                return data[index].value
            })

            for (let currentAxis=1 ; currentAxis<userData.length+1; currentAxis++) {
                coordinates.push( 
                    getCoordinates( scale(userData[currentAxis-1]), currentAxis )
                )
            }
            return coordinates.join(",")
        }

        currentSvg.selectAll(".perfUser").raise()
            .data([ polygonCoordinates(data, scale) ])
            .join("polygon")
            .attr("class", "perfUser")
            .transition().duration(250).ease(easeCubicInOut)
            .attr("points", d => d)
            .attr("fill", "rgba(255, 0, 0, 0.7)")
    }

    const displayAxesLabel =(currentSvg, data, radius, labelChartSpacingInPourcent, fontSizeInPourcent)=> {
        const axesLabel = Array.from({length:data.length}, (_,index)=> {
            return data[index].perfType
        })

        const spacing = labelChartSpacingInPourcent / 100 * widthHeightSize

        const anchor = [
            {label:axesLabel[0] ,type:"start", spacingX:spacing, spacingY:0},
            {label:axesLabel[1] ,type:"start", spacingX:spacing, spacingY:0},
            {label:axesLabel[2] ,type:"middle", spacingX:0, spacingY:spacing*3},
            {label:axesLabel[3] ,type:"end", spacingX:-spacing, spacingY:0},
            {label:axesLabel[4] ,type:"end", spacingX:-spacing, spacingY:0},
            {label:axesLabel[5] ,type:"middle", spacingX:0, spacingY:-spacing*3}
        ]

        const coordinates = []
        const fontSizeInPixel = fontSizeInPourcent / 100 * widthHeightSize

        for (let currentAxis=1 ; currentAxis<axesLabel.length+1; currentAxis++){
            coordinates.push( getCoordinates( radius, currentAxis ))
        }

        for (let index in coordinates){
            const [x,y]= coordinates[index].split(",")
            const {label, type, spacingX, spacingY} = anchor[index]

            currentSvg
                .append("text")
                .attr("x", Number(x) + spacingX)
                .attr("y", Number(y) + 3 + spacingY)
                .text(label)
                .style("font-size", `${fontSizeInPixel}px`)
                .style("font-weight", 700)
                .attr("fill", "#FFFFFF")
                .attr("text-anchor", type)
        }
    }

    const displayIndexedMarker =(currentSvg, scale, valuesOfGraduation)=> {
        
        const drawPolygon =(
            currentSvg, perfValues, scale,
            strokeWidth, strokeColor="black", fillColor="none")=> {
            
            const numberOfAxis = 6
    
            const coordinates = Array.from({length:numberOfAxis+1}, (_,currentAxis)=> {
                if(!currentAxis) return
                return getCoordinates(
                    scale(perfValues[currentAxis-1]),
                    currentAxis
                )
            }).join(" ")
            
            return currentSvg
                .selectAll("indexedMarker")
                .data([null])
                .join("polygon")
                .attr("class", "indexedMarker")
                .attr("points", coordinates)
                .attr("stroke", "#FFFFFF")
                .attr("stroke-width", strokeWidth)
                .attr("fill", fillColor)
        }

        const numberOfAxis = 6

        for (let value of valuesOfGraduation){
            const valuesAxis = Array(numberOfAxis).fill(value)
            const strokeWidth = value % 100 ? 0.2 : 1
            drawPolygon (currentSvg, valuesAxis, scale, strokeWidth, "#FFFFFF")
        }

    }

    const normalizeData =(data, order, language)=> {
        const result = []
        for (let index of order) {
            result.push({
                perfType: language[data[index].perfType],
                value: data[index].value
            })
        }
        return result
    }

    // Hooks
    const svgRef = useRef(null)
    const [widthHeightSize, setWidthHeightSize] = useState(0)

    // Constantes values
    const valuesOfGraduation = [50,100,150,200,250]
    const maxValueOfGraduation = Math.max(...valuesOfGraduation)

    // Size observer
    useEffect(()=>{
        const observer = new ResizeObserver( entries=> {
            setWidthHeightSize(entries[0].contentRect.width)
        })
        observer.observe(svgRef.current)

        return () => observer.disconnect()
    },[])

    // Render
    useEffect(()=>{
        if (!widthHeightSize) return

        if (!data) {data = {
            1: {perfType: "cardio",value: 0 },
            2: {perfType: "energy",value: 0},
            3: {perfType: "endurance",value: 0},
            4: {perfType: "strength",value: 0},
            5: {perfType: "speed",value: 0},
            6: {perfType: "intensity",value:0 },
        }}

        const normalizedData = normalizeData(data, order, language)
        const radiusOfPerfChart = widthHeightSize/2*0.7

        const scale = scaleLinear()
            .domain([0,maxValueOfGraduation])
            .range([0,radiusOfPerfChart])

        const svg = select(svgRef.current)
            .selectAll("svg")
            .data([null])
            .join("svg")
            .attr("width", widthHeightSize)
            .style("background-color", "#282D30")
            .classed("rounded-lg aspect-square", true)

        displayIndexedMarker (svg, scale, valuesOfGraduation)

        displayPerfUser(svg, normalizedData, scale)

        const labelWithChartSpacing = widthHeightSize /100

        displayAxesLabel(svg, normalizedData, radiusOfPerfChart, 2, 4.5)
        
        return () => {
            select(svgRef.current)
                .selectAll(".indexedMarker, text").remove()
        }
    },[widthHeightSize, data])

    return <>
        <div ref={svgRef} className="w-full overflow-auto">
        </div>
    </> 
}

