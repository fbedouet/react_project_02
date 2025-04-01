
import { useEffect, useRef, useState } from "react"
import { select, scaleLinear } from "d3"


/**
 * 
 * @param {{[key: string]:{kilogramm: number, calories: number}>}} activityData
 * @returns React.RefObject<HTMLDivElement>
 */
export function ActivityGph ({activityData}) {

    /**
    * 
    * @param { React.RefObject<SVGSVGElement> } currentSvg main svg container
    * @param { {min: number, mid: number, max: number} } axisCoordinate
    * @param {number[]} padding [up, right, down, left] Percentage value of component dimension
    * @param { {fontSize: number, spacingWithScaleValue: number} } styles Percentage value of component dimension
    * @param { number } fontSize Percentage value of component width size
    * @param { number } spacingWithScaleValue Percentage value of component width between horizontal axes and vertical values in kilograms
    */
    const displayHorizontalAxis =(currentSvg, padding, styles)=> {
        const {spacingWithScaleValue, fontSize} = styles
        const axisCoordinate = getHorizontalAxisValues(activityData, "kilogram")
        const axisValues = !axisCoordinate ? {min: 60, mid: 70, max: 80} : axisCoordinate
        const {width, height} = widthHeightSize
        const paddingInPixel = padding.map((size,i)=> i%2 ? size / 100 * width : size / 100 * height )
        const spacingInPixel = spacingWithScaleValue / 100 * width
        const fontSizeInPixel = fontSize / 100 * width

        const scaleY = scaleLinear()
            .domain([axisValues.min, axisValues.max])
            .range([height - paddingInPixel[2], paddingInPixel[0]])

        currentSvg
            .selectAll("line.axis-line")
            .data(Object.values(axisValues))
            .join("line")
            .attr("class", "axis-line")
            .attr("x1", paddingInPixel[3])
            .attr("y1", d=> scaleY(d) )
            .attr("x2", width - paddingInPixel[1])
            .attr("y2", d=> scaleY(d) )
            .attr("stroke", "#DEDEDE")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray",(_,i)=> i ? "3,3" : "5,0")

        currentSvg
            .selectAll("text.vertical-label")
            .data(Object.values(axisValues))
            .join("text")
            .attr("class", "vertical-label")
            .attr("x", width - paddingInPixel[1] + spacingInPixel)
            .attr("y", d=> scaleY(d) )
            .text(d=>`${d}`)
            .attr("fill", "#9B9EAC")
            .attr("font-size", `${fontSizeInPixel}px`)
            .attr("text-anchor", "end")
    }

    /**
     * Determination of the maximum, minimum and average value of the desired data type
     * @param {{ [key: string]: { kilogram: number, calories: number } }} data
     * @param {string} type Two values accepted for scale type: "Kilogram" or "calories"
     * @returns {{min: number, mid: number, max: number}}
     */
    const getHorizontalAxisValues =(data, type)=> {
        let max=0
        let min=10000
        const days = Object.values(data)
        if (!days[0][type]) return
        for (let day of days){
            if (day[type] > max) { max = day[type] }
            if (day[type] < min) { min = day[type] }
        }
        if(type==="kilogram") min--
        if(type==="calories") min-=50
        const mid = min+(max-min)*0.5
        return {min: min, mid: Math.round(mid), max: max}//[min, Math.round(mid), max]
    }

    /**
     * Placement of the activity board and its horizontal graduations
     * @param {React.RefObject<SVGSVGElement>} currentSvg main svg container
     * @param {{ [key: string]: {kilogramm: number, calories: number} }} data 
     * @param {number[]} padding [up, right, down, left] Percentage value of component dimension
     * @param {{fontSize: number, spacingWithScaleValue: number, spacingWithOverlayInfo: number, widthBar: number, barSpacing: number}} styles Percentage value of component dimension
     */
    const displayActivityChart =(currentSvg, data, padding, styles)=> {
        const {width, height} = widthHeightSize
        const {fontSize, spacingWithOverlayInfo, spacingWithScaleValue, barSpacing, widthBar} = styles
        const paddingInPixel = padding.map((size,i)=> i%2 ? size / 100 * width : size / 100 * height )
        const fontSizeInPixel = fontSize / 100 * width
        const spacingInPixel = spacingWithScaleValue / 100 * height
        const spacingOverlayInPixel = spacingWithOverlayInfo / 100 * width
        const barSpacingInPixel = barSpacing / 100 * width
        const widthBarInPixel = widthBar / 100 * width

        const nbreOfActivity = Object.keys(data).length
        const interval = width/(nbreOfActivity-1)
        const realSizeChart = nbreOfActivity * (widthBarInPixel* 2 + barSpacingInPixel)+ (interval - (widthBarInPixel* 2 + barSpacingInPixel)) * (nbreOfActivity - 1)
        const scaleValue = (1-(realSizeChart - width)/realSizeChart)

        const scaleX = scaleLinear()
            .domain([0, width])
            .range([paddingInPixel[3], width-paddingInPixel[1] ])
        
        const kilogramCoordinate = getHorizontalAxisValues(data, "kilogram")
        const axisKilogramValues = !kilogramCoordinate ? {min: 60, mid: 70, max: 80} : kilogramCoordinate

        const scaleKilogramm = scaleLinear()
            .domain([ axisKilogramValues.min, axisKilogramValues.max ])
            .range([ height-paddingInPixel[2], paddingInPixel[0] ])
        
        const caloriesCoordinate = getHorizontalAxisValues(data, "calories")
        const axisCaloriesValues = !caloriesCoordinate ? {min: 60, mid: 70, max: 80} : caloriesCoordinate

        const scaleCalories = scaleLinear()
            .domain([axisCaloriesValues.min, axisCaloriesValues.max])
            .range([ height-paddingInPixel[2], paddingInPixel[0] ])

        const adjustTransalte = 0
        
        
        currentSvg.selectAll(".day-label")
            .data(Object.keys(data))
            .join("text")
            .attr("class", "day-label")
            .attr("transform", `translate(${widthBarInPixel + barSpacingInPixel*0.5 + adjustTransalte},0) scale(${scaleValue}, 1)` )
            .attr("x", (_,i)=> scaleX(i * interval))
            .attr("y", height - paddingInPixel[2] + spacingInPixel)
            .text(d=> `${d}`)
            .attr("fill", "#9B9EAC")
            .attr("font-size", `${fontSizeInPixel}px`)
            .attr("text-anchor", "middle")
        
        const onClick =(data, svgGroup)=> {
            const existingOverlay = svgGroup.selectAll(".overlay")
            const existingDataIndex = existingOverlay.empty() ? null : existingOverlay.attr("data-index")

            if (existingDataIndex!==null && Number(existingDataIndex)===data.index){
                existingOverlay.remove()
                return
            }

            svgGroup.selectAll(".overlay").remove()

            const overlayDetailWidth = widthBarInPixel*2+barSpacingInPixel*3

            svgGroup.append("rect").lower()
                .attr("transform", `translate(${-barSpacingInPixel},0)`)
                .attr("class","overlay")
                .attr("data-index", data.index)
                .attr("x", scaleX(data.index * interval))
                .attr("y", scaleKilogramm(axisKilogramValues.max))
                .attr("width", overlayDetailWidth)
                .attr("height", scaleKilogramm(axisKilogramValues.min)-paddingInPixel[0])
                .attr("fill", "#C4C4C4")
                .attr("fill-opacity", 0.5)

            const xText = data.index * interval //+ paddingInPixel[3]+ overlayDetailWidth /2

            const overlayInfo = svgGroup.append("text")
                .attr("y", scaleKilogramm(axisKilogramValues.max)-fontSizeInPixel/2)
                .attr("fill", "white")
                .attr("font-size", `${fontSizeInPixel/2}px`)
                .attr("tex-anchor", "middle")
                .attr("class","overlay")

            const tspans = overlayInfo.selectAll("tspan")
                .data([`${data.kilogram}kg`, `${data.calories}Kcal`])
                .join("tspan")
                .attr("x", scaleX(xText)-barSpacingInPixel+width*0.01+overlayDetailWidth+spacingOverlayInPixel)
                .attr("dy", (_, i) => i === 0 ? 0 : "3em")
                .text(d=> `${d}`)

            const bbox = overlayInfo.node().getBBox()

            svgGroup.insert("rect", "text")
                .attr("data-index", data.index)
                .attr("x", bbox.x -width*0.01)
                .attr("y", bbox.y -height*0.05)
                .attr("width", bbox.width +width*0.01*2)
                .attr("height", bbox.height+height*0.05*2)
                .attr("fill", "red")
                .attr("class","overlay")            
        }

        const displayBarChart =(svgGroup, name, yEndValue, translateValue, colorValue)=> {
            svgGroup.selectAll(name)
            .data(Object.values(data))
            .join('path').raise()
            .attr("transform", `translate(${translateValue},0)`)
            .attr("d", (d, i) => {
                const x = scaleX(i * interval)
                const r = widthBarInPixel/2
                const y1 = yEndValue(0)+r
                let y2 = yEndValue(d)+r
            
                return `
                    M ${x-r} ${y1}
                    V ${y2}
                    A ${r} ${r} 0 0 1 ${x+r} ${y2}
                    L ${x+r} ${y1}
                `
            })
            .attr("fill", colorValue)
            .classed("cursor-pointer",true)
            .each((d,i)=>d.index=i)
                .on("click", (event, d)=> {
                    event.stopPropagation()
                    onClick(d, svgGroup)
                })
        }

        const barChartGroup = currentSvg.append("g")
            .attr("transform", `translate(${adjustTransalte},0) scale(${scaleValue}, 1)` )

        const yKilogramValue = d => d.kilogram ? scaleKilogramm(d.kilogram) : scaleKilogramm(axisKilogramValues.min)-widthBarInPixel/2
        const kilogramTranslateValue = widthBarInPixel*0.5
        displayBarChart(barChartGroup, ".kilogram-line", yKilogramValue, kilogramTranslateValue, "black")

        const yCaloriesValue = d => d.calories ? scaleCalories(d.calories) : scaleCalories(axisCaloriesValues.min)-widthBarInPixel/2
        const caloriesTranslateValue = widthBarInPixel*1.5+barSpacingInPixel
        displayBarChart(barChartGroup, ".calories-line", yCaloriesValue, caloriesTranslateValue, "red")

    }

    /**
     * Placing the chart title and legend
     * @param {React.RefObject<SVGSVGElement>} currentSvg main svg container
     * @param {number[]} padding [up, right, down, left] Percentage value of component dimension 
     * @param {{fontSizeTitle: number, fontSizeLegend: number, circleOffset: number, weightTextOffset: number}} styles Percentage value of component dimension
     */
    const displayTitleLegend =(currentSvg, padding, styles)=> {
        const {width, height} = widthHeightSize

        for (const item in styles) {
            const value = styles[item]
            styles[item] = value / 100 * width
        }

        const {fontSizeTitle, fontSizeLegend, circleOffset, weightTextOffset} = styles
        const paddingInPixel = padding.map((size,i)=> i%2 ? size / 100 * width : size / 100 * height )

        currentSvg.append("text")
            .attr("x",paddingInPixel[3])
            .attr("y", paddingInPixel[0])
            .attr("fill", "black")
            .attr("font-size", `${fontSizeTitle}px`)
            .style("font-weight", "bold")
            .text("Activité quotidienne")

        const displayLegend =(posX, text,color)=>{
            const legend = currentSvg. append("text")
                .attr("x",posX)
                .attr("y", paddingInPixel[0])
                .attr("fill", "#74798C")
                .attr("font-size", `${fontSizeLegend}px`)
                .style("font-weight", "bold")
                .attr("text-anchor", "end")
                .text(text)

            const bbox = legend.node().getBBox()

            const radius = fontSizeLegend*0.3

            currentSvg.append("circle")
                .attr("cx",bbox.x - radius/2 - circleOffset)
                .attr("cy", paddingInPixel[0] - fontSizeLegend*0.3)
                .attr("r", radius)
                .attr("fill", color)
        }

        displayLegend (width - paddingInPixel[1] , "Calories brûlées (kCal)", "red")
        displayLegend (width + paddingInPixel[3] - weightTextOffset, "Poids (kg)", "black")
    }

    // Hook
    const svgRef = useRef(null)
    const [widthHeightSize, setwidthHeightSize] = useState(null)

    // Size Observer
    useEffect( ()=> {
        if (!svgRef.current) return
        
        const observer = new ResizeObserver(entries => {
            const {width} = entries[0].contentRect
            const height = width / 2.6
            if (width > 0) {
                setwidthHeightSize({width, height})
            }
        })

        observer.observe(svgRef.current)

        return () => observer.disconnect()
    },[])
   
    // Render
    useEffect( ()=> {
        if (!widthHeightSize) return

        const {width, height} = widthHeightSize

        const svg = select(svgRef.current)
            .selectAll("svg")
            .data([null])
            .join("svg")
            .attr("width", width)
            .attr("height", height)
            .style("background-color", "#F8F8F8")
            .classed("rounded-lg", true)

        svg.on("click", () => {
            svg.selectAll(".overlay").remove();
        })

        const _ = 'Not used'

        const horizontalAxesStyles = {fontSize: 2, spacingWithScaleValue: 11}
        displayHorizontalAxis(svg, [25, 15, 20, 5], horizontalAxesStyles)

        const chartStyles = {fontSize: 2, spacingWithScaleValue: 10, spacingWithOverlayInfo: 0.5, barSpacing: 1.5, widthBar: 1.5}
        displayActivityChart(svg, activityData, [25, 15, 20, 5], chartStyles)

        const titleLegendStyles = {fontSizeTitle: 2, fontSizeLegend:2, circleOffset: 2, weightTextOffset: 40}
        displayTitleLegend(svg, [10, 4, 10, 5], titleLegendStyles)

        return () => {
            select(svgRef.current).selectAll("line.axis-line, g, text, circle").remove()
            svg.selectAll(".overlay").remove()
        }

    },[widthHeightSize, activityData])

    return <>
        <div ref={svgRef} className="w-full h-full overflow-auto">
        </div>
    </>
}