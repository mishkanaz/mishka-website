const SUPABASE_URL = "https://satmvyxotlghtrqmvicb.supabase.co";
const SUPABASE_KEY = "sb_publishable_C8iBx4egDtEn5yeSzM_DWA_ksC94fYe";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


const gallery = document.getElementById("doodleGallery");


async function loadDoodles() {

    const { data, error } = await supabaseClient
        .from("doodles")
        .select("*")
        .order("created_at", {
            ascending: false
        });


    if (error) {

        console.error("Could not load doodles:", error);

        return;
    }


  data.forEach(function(drawing) {

    const doodleDiv = document.createElement("div");

    doodleDiv.className = `
        flex
        flex-col
        items-center
    `;


    const image = document.createElement("img");

    image.src = drawing.image_url;

    image.className = `
        w-full
        h-auto
        border
        border-white
        bg-white
        p-2
    `;

    image.alt = "visitor doodle";

    doodleDiv.appendChild(image);


    const name = document.createElement("p");

    name.textContent =
        `created by: ${drawing.username ?? "anonymous"}`;

    name.className = `
        text-white
        font-[Basis33]
        text-center
        mt-2
    `;

    doodleDiv.appendChild(name);


    gallery.appendChild(doodleDiv);

});

   

}


loadDoodles();