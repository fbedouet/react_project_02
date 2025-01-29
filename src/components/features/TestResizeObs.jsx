import { useEffect, useRef, useState } from "react"
import {select} from "d3"

export function TestResizeObs(){
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
    
    
    
    //update SVG
    useEffect(()=>{
        if (!dimensions.width || !dimensions.height) return

        const svg = select(svgRef.current)
            .selectAll("svg")
            .data([null])
            .join("svg")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)
            .style("background-color", "#282D30")
            .classed("rounded-lg",true)

            const radius = Math.min(dimensions.width, dimensions.height) / 4

            svg.selectAll('circle')
            .data([null])
            .join('circle')
            .attr('cx', dimensions.width / 2)
            .attr('cy', dimensions.height / 2)
            .attr('r', radius)
            .attr('fill', 'steelblue')


    },[dimensions])

    return <div 
        ref={svgRef}
        style={{ 
            width: '100%',
            aspectRatio: "1/1",
            border: '1px solid black',
            resize: 'both',
            overflow: 'auto'
        }}
    >

    </div>
}