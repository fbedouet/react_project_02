import { useEffect, useRef } from "react"
import { select, selectAll } from "d3"

export function ActivityGph({data}){
    const svgRef = useRef(null)
    useEffect( ()=> {
        const kilogram = data.map((index)=>index.kilogram)
        const calories = data.map((index)=>index.calories)
        const width = 600
        const height = 320
        const graphHeight = 145
        const marginBottom = 50
        const marginLeft = 80
        const xAxisLabelPadding = 15
        const valueLineStrokeWidth = 7
        const yAxisLabelPadding = 50

        const lowWeightValue = Number.isInteger(Math.min(...kilogram)) 
        ? Math.min(...kilogram)-1
        : Math.floor(Math.min(...kilogram))
        
        const gapHighLow = Math.ceil(Math.max(...kilogram))-lowWeightValue+1
        
        const weightScale = graphHeight / gapHighLow
        
        const yPos = kilogram.map( data=> {
            if(lowWeightValue>-1){
                const result = (data - lowWeightValue) * weightScale
                return Math.round( result )
            }else{
                return 7
            }
        } )

        
        const yText =[]
        for (let index = 0; index < gapHighLow+1; index++) {
            yText[index]={label:index+lowWeightValue, position: Math.round(index*weightScale)}
        }
       
        const yAxisFontSize = yText.length>5 ? 10 : 14
        const xAxisFontSize = 16
        const gapValues = (width-2*marginLeft-3*valueLineStrokeWidth-yAxisLabelPadding-yAxisFontSize-2)/(data.length-1)
        
        const echelle2 = (graphHeight / Math.max(...calories)*0.7)

        const svg = select(svgRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("background-color", "#F8F8F8")
            .classed("rounded-lg",true)

        {   svg     // Axis layout
            .selectAll("text")
            .data(data)
            .join("text")
            .attr("transform", `translate(${-gapValues+marginLeft+valueLineStrokeWidth},${-marginBottom + xAxisLabelPadding})`)
            .attr("x", (d, i) => (i + 1) * gapValues) // Position x
            .attr("y", height) // Position y
            .text(d=> `${d.day}`)
            .attr("fill", "#9B9EAC")
            .attr("font-size",`${xAxisFontSize}px`)
            
            svg
            .selectAll("x-axis-line")
            .data(yText)
            .join("line")
            .attr("transform", `translate(${-gapValues+marginLeft},${-marginBottom - xAxisFontSize})`)
            .attr("x1",gapValues)
            .attr("y1", d=> height-d.position)
            .attr("x2",data.length*gapValues+valueLineStrokeWidth*3)
            .attr("y2",d=> height-d.position)
            .attr("stroke", "#DEDEDE")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray",(d,i)=> i ? "2,2" : "5,0")
            
            svg
            .selectAll("y-axis-label")
            .data(yText)
            .join("text")
                .attr("transform", `translate(${-gapValues+marginLeft+valueLineStrokeWidth*2},${-marginBottom - xAxisFontSize})`)
                .attr("x",data.length*gapValues+(5+7/2)+yAxisLabelPadding)
                .attr("y",d=> height-d.position)
                .text(d=>d.label)
                .attr("fill",lowWeightValue<0?"none":"#9B9EAC")
                .attr("font-size",yText.length>5 ? `${yAxisFontSize}px` : `${yAxisFontSize}px`)

                
            svg     // Click aréa
            .selectAll("AreaClick")
            .data(data)
            .join("rect")
                .attr("transform", `translate(${-gapValues+marginLeft+valueLineStrokeWidth*2},${-marginBottom - xAxisFontSize})`)
                .attr("x", (d,i)=> (i + 1) * gapValues-valueLineStrokeWidth*2-gapValues/10) 
                .attr("y", height-graphHeight )
                .attr("width", valueLineStrokeWidth*3 + gapValues/5)
                .attr("height", graphHeight)
                .attr("fill", "#C4C4C4")
                .attr("fill-opacity", 0)
                .attr("class", "viewDataValues")
                .each((d,i)=>d.index=i)
                .on("click", function (event, d) {
                    const rectWidth = 39
                    const rectHeight = 63
                    const interline = 20
                    const posX = (d.index + 1) * gapValues - gapValues + gapValues/10 + valueLineStrokeWidth*3 + marginLeft + gapValues/20   //-valueLineStrokeWidth*2-gapValues/10 -gapValues+marginLeft+valueLineStrokeWidth*2+valueLineStrokeWidth*3 + gapValues/5
                    const posY = height -marginBottom - xAxisFontSize - graphHeight - rectHeight/2

                    selectAll("rect")
                        .attr("fill-opacity",0)

                    select(this)
                        .attr("fill-opacity", 0.5)
                    
                    svg.selectAll(".text1").remove()
                    
                    svg.append("rect")
                        .attr("x", posX)
                        .attr("y", posY)
                        .attr("width", rectWidth)
                        .attr("height", rectHeight)
                        .attr("fill", "red")

                    svg.append("text")
                        .attr("y", posY+rectHeight/2-interline/2+7/2)
                        .attr("fill", "white")
                        .style("font-size", "7px")
                        .attr("text-anchor", "middle")
                        .selectAll("tspan")
                            .data([`${d.calories}Kcal`, `${d.kilogram}Kg`])
                            .join("tspan")
                            .attr("x", posX + rectWidth/2)
                            .attr("dy", (d, i) => i * interline)
                            .text(d => d)
                            .attr("class","text1")
                })
        }
            
        {   svg     // Weight data
            .selectAll(".weight-line")
            .data(yPos)
            .join("line")
            .attr("transform", `translate(${-gapValues+marginLeft},${-marginBottom - xAxisFontSize})`)
            .attr("x1", (d, i) => (i + 1) * gapValues + valueLineStrokeWidth/2) // Position x de départ
            .attr("y1", (d) => height) // Position y de départ
            .attr("x2", (d, i) => (i + 1) * gapValues + valueLineStrokeWidth/2) // Position x d'arrivée
            .attr("y2", (d, i) => height - d + valueLineStrokeWidth/2) // Position y d'arrivée
            .attr("stroke", lowWeightValue<0?"none":"black")
            .attr("stroke-width", valueLineStrokeWidth)
            
            svg
            .selectAll("weight-round")
            .data(yPos)
            .join("circle")
            .attr("transform", `translate(${-gapValues+marginLeft},${-marginBottom - xAxisFontSize})`)
            .attr("cx",(d, i) => (i + 1) * gapValues +valueLineStrokeWidth/2)
            .attr("cy", (d, i) => height - d +valueLineStrokeWidth/2)
            .attr("r", valueLineStrokeWidth/2)
            .attr("fill",lowWeightValue<0?"none":"black")
        }
        
        {   svg     // Calories data
            .selectAll(".calories-line")
            .data(calories)
            .join("line")
            .attr("transform", `translate(${-gapValues+marginLeft+valueLineStrokeWidth*2},${-marginBottom - xAxisFontSize})`)
            .attr("x1", (d, i) => (i + 1) * gapValues+valueLineStrokeWidth/2) // Position x de départ
            .attr("y1", (d) => height) // Position y de départ
            .attr("x2", (d, i) => (i + 1) * gapValues+valueLineStrokeWidth/2) // Position x d'arrivée
            .attr("y2", (d, i) => height - d * echelle2 +valueLineStrokeWidth/2) // Position y d'arrivée
            .attr("stroke", lowWeightValue<0?"none":"red")
            .attr("stroke-width", valueLineStrokeWidth)
            
            svg
            .selectAll("weight-round")
            .data(calories)
            .join("circle")
            .attr("transform", `translate(${-gapValues+marginLeft+valueLineStrokeWidth*2},${-marginBottom - xAxisFontSize})`)
            .attr("cx",(d, i) => (i + 1) * gapValues + valueLineStrokeWidth/2)
            .attr("cy", (d, i) => height - d * echelle2 + valueLineStrokeWidth/2)
            .attr("r", valueLineStrokeWidth/2)
            .attr("fill",lowWeightValue<0?"none":"red")
        }

        { svg.append("text")
            .attr("x", 32)
            .attr("y", 40)
            .text("Activité quotidienne")
            .style("font-size","15px")
            .attr("fill", "black")
        }
        
        { svg.append("circle")
            .attr("cx", width-300)
            .attr("cy", 36)
            .attr("r", 4)
            .attr("fill","black")
        }
        
        { svg.append("text")
            .attr("x", width-300+16)
            .attr("y", 40)
            .text("Poids (Kg)")
            .style("font-size","15px")
            .attr("fill", "black")
        }

        { svg.append("circle")
            .attr("cx", width-190)
            .attr("cy", 36)
            .attr("r", 4)
            .attr("fill","red")
        }
        
        { svg.append("text")
            .attr("x", width-190+16)
            .attr("y", 40)
            .text("Calories brûlées (kCal")
            .style("font-size","15px")
            .attr("fill", "black")
        }
        
        return () => {
            select(svgRef.current).selectAll("*").remove()
        }
    
    },[data])


    return <div className="rounded-lg " ref={svgRef}></div>
}