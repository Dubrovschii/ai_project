<script setup>
import logo from "@/assets/img/logo.webp";
import sidemenu from "@/components/sidemenu.vue";
import axios from "axios";
import { useNotification } from "@kyvg/vue3-notification";
import promo from "@/components/promo.vue";
import { ref, watch, onMounted } from "vue";
import { useApiStore } from "@/stores/apiStore";

const apiStore = useApiStore();
const { notify } = useNotification();

const form = ref(null);

const userName = ref(apiStore.getCookie("user_name"));
const name = ref("");
const message = ref("");
const rating = ref(5);

const nameRules = ref([
  (v) => !!v || "Name is required",
  (v) => (v && v.length >= 2) || "Name must be at least 2 characters",
]);
const messageRules = ref([
  (v) => !!v || "Message is required",
  (v) => (v && v.length <= 100) || "Message must be 100 characters or less",
]);

const select = ref(null);
const checkbox = ref(false);

const reviewList = ref([]);
const page = ref(1);
const totalPages = ref(0);
const showreview = ref(false);

const review_title = ref("");
const review_descr = ref("");
const review_form_title = ref("");
const review_form_descr = ref("");
const review_form_btn = ref("");
const review_form_account_label = ref("");
const review_form_textarea_label = ref("");

async function submitReview() {
  try {
    const response = await axios.post("/api/comments", {
      author: userName.value,
      text: message.value,
      rating: rating.value,
    });

    if (response.data.success) {
      notify({
        title: "Review Submitted",
        text: "Your review was successfully submitted!",
        type: "success",
      });
      message.value = "";
      rating.value = 5;
      getReview();
    } else {
      notify({
        title: "Error",
        text: "Failed to submit review.",
        type: "error",
      });
    }
  } catch (error) {
    console.error("Error submitting review:", error);
    notify({
      title: "Error",
      text: "Something went wrong.",
      type: "error",
    });
  }
}

async function getReview() {
  try {
    const response = await axios.get("/api/comments", {
      params: { page: page.value },
    });

    if (response.data.success) {
      showreview.value = true;
      totalPages.value = response.data.totalPages;
      reviewList.value = response.data.comments;

      notify({
        title: "Reviews Loaded",
        text: `${response.data.comments.length} reviews fetched successfully!`,
        type: "success",
      });
    } else {
      notify({
        title: "Error",
        text: "Failed to load reviews.",
        type: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
    notify({
      title: "Error",
      text: "Failed to load reviews.",
      type: "error",
    });
  }
}

async function deleteComment(commentId) {
  try {
    const response = await axios.delete(`/api/comments/${commentId}`);

    if (response.data.success) {
      reviewList.value = reviewList.value.filter(
        (comment) => comment._id !== commentId
      );

      notify({
        title: "Comment Deleted",
        text: "The comment was successfully deleted.",
        type: "success",
      });
    } else {
      notify({
        title: "Error",
        text: "Failed to delete comment.",
        type: "error",
      });
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    notify({
      title: "Error",
      text: "Something went wrong.",
      type: "error",
    });
  }
}

watch(page, () => {
  getReview();
});

watch(
  () => apiStore.contentReviewPage.value,
  (newValue) => {
    if (newValue) {
      review_title.value = newValue.review_title;
      review_descr.value = newValue.review_descr;
      review_form_title.value = newValue.review_form_title;
      review_form_descr.value = newValue.review_form_descr;
      review_form_btn.value = newValue.review_form_btn;
      review_form_account_label.value = newValue.review_form_account_label;
      review_form_textarea_label.value = newValue.review_form_textarea_label;
    }
  },
  { immediate: true }
);

onMounted(async () => {
  getReview();
  // await apiStore.loadTranslations(apiStore.currentLang);
});

function reset() {
  if (form.value) {
    form.value.reset();
  }
}
</script>

<template class="review">
  <img :src="logo" alt="" class="logo" />
  <sidemenu />
  <div class="container">
    <promo :title="review_title" :description="review_descr" highlight="" />
    <div class="col-sm-12 mt-big p0">
      <div class="row review__row">
        <div
          v-for="(review, index) in reviewList"
          :key="index"
          :class="`col-lg-4 col-md-6 col-sm-6 review__block `"
        >
          <div class="review__text">
            <v-btn
              @click="deleteComment(review._id)"
              icon
              aria-label="Delete comment"
              class="review__delete"
              v-if="userName == review.author"
            >
              <v-icon>mdi-window-close</v-icon>
            </v-btn>
            <div class="review__rating">{{ review.rating }}</div>
            <div class="review__author">{{ review.author }}</div>
            <div class="review__message mt-small">{{ review.text }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center review__pagination">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" class="p0important">
            <v-container class="max-width p0important">
              <v-pagination
                v-model="page"
                :length="totalPages"
                class="my-4"
                v-if="totalPages > 1"
              ></v-pagination>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <v-sheet class="mx-auto review__form" width="auto">
      <v-form ref="form">
        <div class="review__form_head">
          <div class="review__form_title">{{ review_form_title }}</div>
          <div class="review__form_descr">{{ review_form_descr }}</div>
        </div>
        <div class="label">{{ review_form_account_label }}</div>
        <v-text-field
          v-model="userName"
          :rules="nameRules"
          required
          readonly
        ></v-text-field>
        <div class="label">{{ review_form_textarea_label }}</div>
        <v-textarea
          v-model="message"
          :rules="messageRules"
          height="200"
          :counter="300"
        ></v-textarea>
        <v-rating
          hover
          :length="5"
          :size="32"
          v-model="rating"
          active-color="#7cfdfe"
          color="#45c7ff"
        />
        <!-- <v-checkbox
          v-model="checkbox"
          :rules="[(v) => !!v || 'You must agree to continue!']"
          label="Do you agree?"
          required
        ></v-checkbox> -->
        <div class="d-flex flex-column">
          <v-btn
            class="mt-2"
            type="submit"
            color="success"
            block
            @click="submitReview"
            >{{ review_form_btn }}</v-btn
          >
          <!-- <v-btn class="mt-4" color="error" block @click="reset">
            Reset Form
          </v-btn> -->
        </div>
      </v-form>
    </v-sheet>
  </div>
</template>

<style lang="scss">
.review {
  &__row {
    display: flex;
    flex-wrap: wrap;
  }
  &__block {
    margin-bottom: 20px;

    display: flex;
    flex-flow: column;
    min-height: 1px;
    height: auto;
  }
  &__text {
    border: 1px solid #7cfdfe;
    box-shadow: -1px 0px 9px 1px #45c7ff;
    color: #45c7ff;
    font-weight: bold;
    border-radius: 5px;
    transition: all 0.3s ease;
    display: flex;
    align-items: start;
    flex-flow: column;
    min-height: 100px;
    height: 100%;
    padding: 10px;
    font-family: "Montserrat", sans-serif;
    font-weight: 400;
    line-height: 1.2;
    position: relative;
    .review__delete {
      position: absolute;
      top: 10px;
      right: 15px;
      width: 25px !important;
      height: 25px !important;
      background: none !important;
      color: red;
      border: 1px solid red;
    }
  }
  &__pagination {
    width: 100%;
  }
  &__form {
    background: none;
    margin-bottom: 40px;
    &_head {
      font-family: "Open Sans", sans-serif;
      font-weight: 900;
      color: #7cfdfe;
      font-size: clamp(25px, 3vw, 32px);
      text-align: center;
      margin-bottom: 20px;
    }
    .v-form {
      background: var(--color-background);
      .v-field__field {
        border: 1px solid #7cfdfe;
        box-shadow: -1px 0px 9px 1px #45c7ff;
        border-radius: 5px;
        color: #45c7ff;
        input {
          padding-top: 0;
          padding-bottom: 0;
        }
      }
      .v-textarea {
        color: #45c7ff;
      }
      .label {
        color: #7cfdfe;
        font-family: "Open Sans", sans-serif;
        font-weight: 900;
        font-size: 20px;
      }
    }
  }
}
</style>
