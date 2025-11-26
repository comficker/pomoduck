<script setup lang="ts">

</script>

<template>
  <NuxtLink to="/nest" class="block relative">
    <div class="knock-button size-12 md:size-16"></div>
    <div class="absolute -left-3 md:-left-6 -top-10 md:-top-12">
      <div id="egg" class="size-16 md:size-24">
        <svg viewBox="0 0 1280 1280" version="1.1" xmlns="http://www.w3.org/2000/svg"
             xmlns:xlink="http://www.w3.org/1999/xlink">
          <defs>
            <g id="egg_ref" transform="translate(-0, 0)">
              <path
                  d="M575.215182,422.749293 C568.693266,619.651665 436.5765,718.390264 277.796607,713.132987 C119.028702,707.887687 -6.27841483,600.646431 0.243501681,403.744059 C6.76541819,206.853664 142.634682,-5.14990545 301.414577,0.0953955247 C460.182482,5.3406965 581.737099,225.846923 575.215182,422.749293 Z"
                  id="Path" stroke="#000000" stroke-width="22.68" fill="#F9EDD4" fill-rule="nonzero"
                  stroke-linecap="round" stroke-linejoin="round"></path>
              <path
                  d="M538.24167,423.575608 C535.795951,497.860088 512.537646,560.133067 471.04435,603.67625 C432.656158,643.938127 379.653596,667.829395 317.755334,672.73938 C306.557779,673.625573 294.964593,673.889035 283.359418,673.493841 C213.021028,671.158604 153.424617,646.764363 111.056138,602.933765 C90.5192946,581.71305 74.6461007,556.300884 63.6643442,527.355924 C110.132999,564.108958 169.681454,584.036311 235.044485,586.191913 C389.688237,591.293508 518.364211,495.141632 524.718284,303.364806 C524.754251,302.478613 524.766239,301.604397 524.790217,300.706229 C534.812868,341.518982 539.56044,383.529292 538.229681,423.575608 L538.24167,423.575608 Z"
                  id="Path" fill="#F4D4AB" fill-rule="nonzero"></path>
              <path
                  d="M323.569911,86.3434722 C362.557544,87.6368341 399.327246,101.756035 432.572236,125.216183 C415.81187,103.22903 397.349092,84.6668921 378.143006,70.6674472 C349.921331,50.1053884 320.380885,39.1836658 290.360887,38.1896933 C285.289618,38.0220352 280.146415,38.1417909 275.063156,38.5489605 C217.852521,43.0877026 161.061495,83.26575 115.144325,151.682199 C74.0946151,212.853426 47.683251,288.383365 41.2092897,361.94931 C87.6899337,210.829554 198.622458,82.2118996 323.569911,86.3434722 L323.569911,86.3434722 Z"
                  id="Path" fill="#FFFFFF" fill-rule="nonzero"></path>
            </g>
          </defs>
          <g stroke="none" fill="none" fill-rule="evenodd">
            <g stroke-width="1" transform="translate(437.3333, 606.8148)">
              <use xlink:href="#egg_ref"/>
            </g>
            <g id="broking" transform="translate(478, 643)">
              <polyline
                  class="broking_1" stroke="#000000" stroke-width="12.07" stroke-linecap="round"
                  stroke-linejoin="round"
                  points="202.197663 285.8315 190.942829 253.348192 220.899666 239.26729 233.667956 227.311128 231.505875 200.265714 240.910929 182.163412 316.055263 154.63783 355.044794 34.6920764 383.92059 0"/>
              <polyline
                  class="broking_3" stroke="#000000" stroke-width="12.07" stroke-linecap="round"
                  stroke-linejoin="round"
                  points="202.441912 285.718213 229.221592 374.303168 196.184529 410.015552 211.935872 457.908069 167.83451 457.908069 123.745135 533.976889 132.759603 598.777587 87.6393188 622.069838"/>
            </g>
          </g>
        </svg>
      </div>
    </div>
    <div class="absolute bottom-0 -inset-x-1 bg-[#F6C201] leading-none py-1 rounded shadow text-2xs uppercase">
      <div>KNock</div>
      <div>Eggs</div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.knock-button {
  border-radius: 50px;
  background-color: #F9E2C2;
  border: 3px solid #F6C201;
}

@keyframes shake {
  50% {
    transform: rotate(-6deg);
  }
  60% {
    transform: rotate(0deg);
  }
  70% {
    transform: rotate(-4deg);
  }
  80% {
    transform: rotate(6deg);
  }
  90% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-5deg);
  }
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

#egg {
  transform-origin: bottom center;
  animation: shake 2s linear infinite;
  animation-iteration-count: infinite;
}

.broking_1,
.broking_3 {
  opacity: 0;
  animation: fade 4s linear infinite;
}

.broking_1 {
  animation-delay: 100ms;

}

.broking_3 {
  animation-delay: 1000ms;
}
</style>
