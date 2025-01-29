import { useEffect, useRef, useState } from "react"
import { scaleLinear, select } from "d3"

export function PerformanceGph ({data}){

    // Functions
    const getCoordinates =(cx, cy, rx, ry, currentAxis)=> {
        const angle = 2*Math.PI / 6
        const endX = cx - rx * Math.cos(angle*currentAxis+Math.PI/2)
        const endY = cy - ry * Math.sin(angle*currentAxis+Math.PI/2)
        return`${endX},${endY}`
    } 

    const drawPolygon =(svg,
        perfValues,
        xScale, yScale,
        strokeWidth, strokeColor="black", fillColor="none")=> {
        const cx = dimensions.width/2
        const cy = dimensions.height/2
        const nbAxes = 6

        const coordinates = Array.from({length:nbAxes+1}, (_,currentAxis)=> {
            if(!currentAxis) return
            return getCoordinates(
                cx,cy, 
                xScale(perfValues[currentAxis-1]),
                yScale(perfValues[currentAxis-1]),
                currentAxis
            )
        }).join(" ")

        return svg
            .append("polygon")
            .attr("points", coordinates)
            .attr("stroke", strokeColor)
            .attr("stroke-width", strokeWidth)
            .attr("fill", fillColor)
    }

    const drawLabel =(svg,posX, posY, label, anchorPos)=> {
        const fontSize = Math.min(dimensions.width, dimensions.height) / 25;

        svg
        .append("text")
        .attr("x", posX)
        .attr("y", posY)
        .text(label)
        .style("font-size", `${fontSize}px`)
        .style("font-weight", 700)
        .attr("fill", "#FFFFFF")
        .attr("text-anchor", anchorPos)
    }

    const drawAllLabels =(svg, labels)=> {
        const spacing = Math.min(dimensions.width, dimensions.height) /100
        const anchor = [
            {label:labels[0] ,type:"start", spacingX:spacing, spacingY:0},
            {label:labels[1] ,type:"start", spacingX:spacing, spacingY:0},
            {label:labels[2] ,type:"middle", spacingX:0, spacingY:spacing*5},
            {label:labels[3] ,type:"end", spacingX:-spacing, spacingY:0},
            {label:labels[4] ,type:"end", spacingX:-spacing, spacingY:0},
            {label:labels[5] ,type:"middle", spacingX:0, spacingY:-spacing*4}
        ]
        const center = {x: dimensions.height/2, y: dimensions.height/2}
        const radius = {x: dimensions.width/2*0.75, y: dimensions.height/2*0.75}
        const numberOfAxis = 6
        const coordinates = []

        for (let currentAxis=1 ; currentAxis<numberOfAxis+1; currentAxis++){
            coordinates.push( getCoordinates(
                center.x,center.y,
                radius.x, radius.y,
                currentAxis
            ))
        }

        for (let index in coordinates){
            const [x,y]= coordinates[index].split(",")
            const {label, type, spacingX, spacingY} = anchor[index]

            drawLabel(
                svg,
                Number(x) + spacingX,
                Number(y) + 3 + spacingY,
                label,
                type
            )
        }
    }

    const drawPerfGraduation =(svg, xScale, yScale, values)=> {
        
        const numberOfAxis = Object.keys(data).length
        for (let value of values){
            const valuesAxis = Array(numberOfAxis).fill(value)
            const strokeWidth = value % 100 ? 0.2 : 1
            drawPolygon (svg, valuesAxis, xScale, yScale,strokeWidth,"#FFFFFF")
        }
    }

    const drawPerfUser =(svg, xScale, yScale)=> {
        const valueAxis = Object.values(data)
        drawPolygon(svg, valueAxis, xScale, yScale, 0 ,"none", "rgba(255, 0, 0, 0.7)")
    }

    // Constantes values
    const valuesOfGraduation = [50,100,150,200,250]
    const maxValueOfGraduation = Math.max(...valuesOfGraduation)
    const axesLabel = ["Vitesse", "Force", "Endurance", "Energie", "Cardio", "Intensité"]

    // Hooks
    const svgRef = useRef(null)
    const [dimensions, setDimensions] = useState({width:0, height:0})

    // Size observer
    useEffect(()=>{
        const observer = new ResizeObserver( entries=> {
            setDimensions({
                width: entries[0].contentRect.width,
                height: entries[0].contentRect.height
            })
        })
        observer.observe(svgRef.current)

        return () => observer.disconnect()
    },[])
    
    // Render
    useEffect( ()=> {
        if (!dimensions.width || !dimensions.height) return
        if (!data) return

        const radiusOfPerfChart = dimensions.width/2*0.7

        const xScale = scaleLinear()
            .domain([0,maxValueOfGraduation])
            .range([0,radiusOfPerfChart])

        const yScale = scaleLinear()
            .domain([0,maxValueOfGraduation])
            .range([0,radiusOfPerfChart])

        const svg = select(svgRef.current)
            .selectAll("svg")
            .data([null])
            .join("svg")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)
            .style("background-color", "#282D30")
            .classed("rounded-lg",true)

        drawPerfGraduation(svg, xScale, yScale, valuesOfGraduation)
        drawAllLabels(svg, axesLabel,radiusOfPerfChart)
        drawPerfUser(svg, xScale, yScale)
        
        return () => {
            select(svgRef.current).selectAll("*").remove()
        }

    },[dimensions, data])

    return <div 
        ref={svgRef}
        className="w-full aspect-square resize overflow-auto"
    >
    </div>
}