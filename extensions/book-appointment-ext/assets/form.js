(function () {
  const tagName = "product-availability";
  const url = "http://localhost:52678";

  if (!customElements.get(tagName)) {
    customElements.define(
      tagName,
      class extends HTMLElement {
        dataset = null;
        dateInput = null;
        staffSelect = null;
        hourSelect = null;

        constructor() {
          super();
          let template = document.getElementById("product-availability");
          this.dataset = template.dataset;
          this.appendChild(template.content.cloneNode(true));

          this.dateInput = this.querySelector("#date");
          this.dateInput.addEventListener("change", this.onChange.bind(this));

          this.staffSelect = this.querySelector("#Staff");
          this.staffSelect.addEventListener("change", this.onChange.bind(this));

          this.hourSelect = document.querySelector("#Hour");

          fetch(
            `${url}/api/widget/staff?shop=yguuy&productId=${this.dataset.productId}`
          ).then(this.onStaffFetch.bind(this));
        }

        onChange() {
          if (this.dateInput.value !== "" && this.staffSelect.value !== "") {
            fetch(
              `${url}/api/widget/availability?shop=yguuy&date=${this.dateInput.value}&userId=${this.staffSelect.value}`
            )
              .then(this.onAvailabilityFetch.bind(this))
              .finally(() => {
                this.hourSelect.disabled = false;
              });
          }
        }

        async onAvailabilityFetch(response) {
          this.hourSelect.length = 0;
          const { payload } = await response.json();
          payload.forEach((element) => {
            var opt = document.createElement("option");
            const date = new Date(element.start_time);
            const value =
              date.getHours() +
              ":" +
              (date.getMinutes() < 10 ? "0" : "") +
              date.getMinutes();
            opt.value = date.toISOString();
            opt.innerHTML = value;
            this.hourSelect.appendChild(opt);
          });
        }

        async onStaffFetch(response) {
          const { payload } = await response.json();
          payload.forEach((element) => {
            var opt = document.createElement("option");
            opt.value = element.id;
            opt.innerHTML = element.fullname;
            this.staffSelect.appendChild(opt);
          });
        }
      }
    );

    const div = document.querySelector(".product-form__buttons");
    div.innerHTML =
      "<product-availability></product-availability>" + div.innerHTML;
  }
})();
