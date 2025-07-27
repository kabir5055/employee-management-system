<!-- resources/js/Components/ImportExport.vue -->
<template>
  <div class="space-y-4">
    <!-- Export Section -->
    <div class="bg-white shadow rounded-lg p-4">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Export {{ title }}</h3>
      <div class="flex space-x-4">
        <button
          v-for="type in exportTypes"
          :key="type"
          @click="handleExport(type)"
          :disabled="isExporting"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <template v-if="isExporting && exportingType === type">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </template>
          <span>Export as {{ type.toUpperCase() }}</span>
        </button>
      </div>
    </div>

    <!-- Import Section -->
    <div class="bg-white shadow rounded-lg p-4">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Import {{ title }}</h3>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <label class="relative cursor-pointer bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md text-white">
            <span>Choose File</span>
            <input
              type="file"
              class="hidden"
              :accept="acceptedFiles"
              @change="handleFileSelect"
              :disabled="isImporting"
            >
          </label>
          <span v-if="selectedFile" class="text-sm text-gray-600">
            {{ selectedFile.name }}
          </span>
        </div>

        <button
          v-if="selectedFile"
          @click="handleImport"
          :disabled="isImporting"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          <template v-if="isImporting">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </template>
          <span>Import</span>
        </button>

        <!-- Import Errors -->
        <div v-if="importErrors.length > 0" class="mt-4">
          <h4 class="text-sm font-medium text-red-800 mb-2">Import Errors:</h4>
          <div class="bg-red-50 p-4 rounded-md">
            <ul class="list-disc list-inside text-sm text-red-700 space-y-1">
              <li v-for="(error, index) in importErrors" :key="index">
                Row {{ error.row }}: {{ error.errors?.join(', ') || error.message }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Import Success -->
        <div v-if="successMessage" class="mt-4 p-4 bg-green-50 rounded-md">
          <p class="text-sm text-green-700">{{ successMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    exportRoute: {
      type: String,
      required: true
    },
    importRoute: {
      type: String,
      required: true
    },
    exportTypes: {
      type: Array,
      default: () => ['excel', 'csv', 'pdf']
    },
    acceptedFileTypes: {
      type: Array,
      default: () => ['.xlsx', '.csv']
    }
  },

  data() {
    return {
      isExporting: false,
      exportingType: null,
      isImporting: false,
      selectedFile: null,
      importErrors: [],
      successMessage: '',
      acceptedFiles: ''
    }
  },

  created() {
    this.acceptedFiles = this.acceptedFileTypes.join(',')
  },

  methods: {
    async handleExport(type) {
      this.isExporting = true
      this.exportingType = type
      try {
        const response = await axios.post(
          this.exportRoute,
          { type },
          { responseType: 'blob' }
        )

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${this.title.toLowerCase()}_${new Date().toISOString().split('T')[0]}.${type}`)
        document.body.appendChild(link)
        link.click()
        link.remove()

        this.$emit('export-success')
      } catch (error) {
        console.error('Export failed:', error)
        this.$emit('export-error', error)
      } finally {
        this.isExporting = false
        this.exportingType = null
      }
    },

    handleFileSelect(event) {
      this.selectedFile = event.target.files[0]
      this.importErrors = []
      this.successMessage = ''
    },

    async handleImport() {
      if (!this.selectedFile) return

      this.isImporting = true
      this.importErrors = []
      this.successMessage = ''

      const formData = new FormData()
      formData.append('file', this.selectedFile)

      try {
        const response = await axios.post(this.importRoute, formData)

        if (response.data.importErrors) {
          this.importErrors = response.data.importErrors
        }

        if (response.data.success) {
          this.successMessage = response.data.success
          this.selectedFile = null
          this.$emit('import-success')
        }
      } catch (error) {
        console.error('Import failed:', error)
        this.importErrors = [{
          row: 'Error',
          message: error.response?.data?.message || 'Import failed. Please try again.'
        }]
        this.$emit('import-error', error)
      } finally {
        this.isImporting = false
      }
    }
  }
}
</script>
