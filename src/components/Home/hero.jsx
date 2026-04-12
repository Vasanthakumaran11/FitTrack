import Activities from "./activities";
function HeroPage(){

    const a = [
        {
            img: "jogging.webp",
            work: "Jogging",
            desc: "Jogging for 60 minutes"
        },
        {
            img: "images.jpg",
            work: "Yoga",
            desc: "Doing yoga for 30 minutes"
        },
        {
            img: "bk-1.jpg",
            work: "BreakFast",
            desc: "A Healthy BreakFast"
        },
        {
            img: "lunch-1.jpg",
            work: "Lunch",
            desc: "A Nutritious Lunch"
        },
        {
            img: "Gym-1.jpg",
            work: "Gym",
            desc: "A Heavy Workout"
        },
        {
            img: "water.jpg",
            work: "Water",
            desc: "Drinking 8 glasses of water"
        },
        {
            img: "dinner.jpg",
            work: "Dinner",
            desc: "A Light Dinner"
        },
        {
            img: "sleep.avif",
            work: "Sleep",
            desc: "Sleeping for 8 hours"
        },
        {
            img:"snack.jpg",
            work:"Snack",
            desc:"Eating a Healthy Snack"

        },
        
    ]
    const Activities1 = a.map((item,index) => {
        return <Activities key={index} img={item.img} work={item.work} desc={item.desc} />;
    })

    return(
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">My Daily Activities</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {Activities1}
            </div>
        </div>
    )
}
export default HeroPage;