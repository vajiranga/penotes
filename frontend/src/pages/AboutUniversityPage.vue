<template>
  <q-page class="q-pa-md q-pa-lg-xl bg-grey-1">
    
    <!-- Header Section -->
    <div class="row q-mb-xl items-center">
      <q-btn flat round icon="arrow_back" color="teal-10" @click="$router.back()" class="q-mr-sm" />
      <div>
        <h4 class="text-weight-bold text-teal-10 q-my-none">
          About University
        </h4>
        <p class="text-subtitle1 text-grey-8 q-mt-xs q-mb-none">
          Our history, specifications, and what makes us special.
        </p>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="row q-col-gutter-lg justify-center">
      
      <!-- History Card -->
      <div class="col-12 col-md-8">
        <q-card class="shadow-2" style="border-radius: 12px; height: 100%;">
          <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" height="200px">
            <div class="absolute-bottom text-h5 text-weight-bold">
              How it all started
            </div>
          </q-img>
          <q-card-section class="q-pa-lg">
            <h6 class="text-weight-bold text-grey-9 q-mt-none q-mb-sm">Our Foundation</h6>
            <p class="text-body1 text-grey-8" style="line-height: 1.6;">
              The university was established with a vision to provide world-class education accessible to everyone. 
              Starting from a small campus, we have grown into a multi-disciplinary institution that fosters innovation, 
              creativity, and academic excellence. Over the years, we have built a vibrant community of passionate learners and educators.
            </p>
            <p class="text-body1 text-grey-8" style="line-height: 1.6;">
              Our founding members believed in practical, hands-on learning, which is why Campus Notes was born—to digitize and simplify the way students interact with their educational materials.
            </p>
          </q-card-section>
        </q-card>
      </div>

      <!-- Specifications / Quick Facts -->
      <div class="col-12 col-md-4">
        <q-card class="shadow-2 bg-teal-9 text-white" style="border-radius: 12px; height: 100%;">
          <q-card-section class="q-pa-lg">
            <div class="text-h6 text-weight-bold q-mb-md">
              <q-icon name="verified" size="sm" class="q-mr-sm" /> 
              University Specifications
            </div>
            
            <q-list dark separator>
              <q-item class="q-py-md">
                <q-item-section avatar>
                  <q-icon name="public" color="teal-3" size="lg" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">Global Ranking</q-item-label>
                  <q-item-label caption class="text-teal-1">Top 500 Universities worldwide</q-item-label>
                </q-item-section>
              </q-item>
              
              <q-item class="q-py-md">
                <q-item-section avatar>
                  <q-icon name="groups" color="teal-3" size="lg" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">Student Body</q-item-label>
                  <q-item-label caption class="text-teal-1">Over 25,000 active students</q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="q-py-md">
                <q-item-section avatar>
                  <q-icon name="library_books" color="teal-3" size="lg" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">Library Resources</q-item-label>
                  <q-item-label caption class="text-teal-1">2M+ digital & physical materials</q-item-label>
                </q-item-section>
              </q-item>
              
              <q-item class="q-py-md">
                <q-item-section avatar>
                  <q-icon name="domain" color="teal-3" size="lg" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">Campus Size</q-item-label>
                  <q-item-label caption class="text-teal-1">150 Acres with modern labs</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

          </q-card-section>
        </q-card>
      </div>

    </div>
  </q-page>
</template>

<script setup>
// Special page logic goes here if needed later
</script>

<style scoped>
</style>
