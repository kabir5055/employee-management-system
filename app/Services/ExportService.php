<?php

namespace App\Services;

use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use App\Exports\BaseExport;

class ExportService
{
    public function export($data, string $type, string $exportClass, string $filename)
    {
        $export = new $exportClass($data);

        switch (strtolower($type)) {
            case 'excel':
                return Excel::download($export, $filename . '.xlsx');

            case 'csv':
                return Excel::download($export, $filename . '.csv', \Maatwebsite\Excel\Excel::CSV);

            case 'pdf':
                return $this->exportToPdf($data, $export, $filename);

            default:
                throw new \InvalidArgumentException("Unsupported export type: {$type}");
        }
    }

    protected function exportToPdf($data, BaseExport $export, string $filename)
    {
        $headers = $export->headings();
        $rows = [];

        foreach ($data as $item) {
            $rows[] = $export->map($item);
        }

        $pdf = PDF::loadView('exports.pdf', [
            'headers' => $headers,
            'rows' => $rows,
            'filename' => Str::title(str_replace('_', ' ', $filename))
        ]);

        return $pdf->download($filename . '.pdf');
    }
}
