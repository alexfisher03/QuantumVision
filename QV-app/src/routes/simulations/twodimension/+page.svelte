<script lang="ts">
    import arrowdown from '$lib/vectors/transitionarrow_down.svg';
    import figure2 from '$lib/images/2d_figure.png';
</script>

<section>
    <div class="flex justify-center">
        <h1 class="gradient-text text-transparent -translate-y-20 font-semibold animate-gradient w-fit">Particle in a 2-Dimensional Box</h1>
    </div>
    <div class="grid grid-cols-[1.6fr_1.2fr] gap-32 md:gap-40 xxl:gap-52 py-4">
        <div class="flex flex-col justify-start w-full max-w-[650px]">
            
        </div>
        <div class="flex flex-col items-center">
            <img src={figure2} alt="2D Figure" class="scale-[135%] translate-y-10"/>
        </div>
    </div>

    <div class="flex justify-center">
        <a href="/simulations/onedimension" class="absolute bottom-0 transform pb-3">
            <img src={arrowdown} alt="Move Back To Info Page" class="hover:-translate-y-2 transform transition ease-in-out duration-200"/>
        </a>
    </div>
</section>

<style>
    .gradient-text {
        background: linear-gradient(
            to right,
            #393939,
            #5c5c5c,
            #999999,
            #FFFFFF,
            #999999,
            #5c5c5c,
            #393939,
            #5c5c5c,
            #999999,
            #FFFFFF
        );
        background-size: 300% 300%;
        background-clip: text;
    }
</style>