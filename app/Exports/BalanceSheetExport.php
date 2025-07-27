<?php

namespace App\Exports;

use App\Models\BalanceSheet;
use Carbon\Carbon;

class BalanceSheetExport extends BaseExport
{
    protected function query()
    {
        return BalanceSheet::with(['employee', 'updatedByUser'])
            ->when($this->filters['employee_id'] ?? null, function ($query, $employeeId) {
                $query->where('employee_id', $employeeId);
            })
            ->when($this->filters['date_from'] ?? null, function ($query, $dateFrom) {
                $query->where('date', '>=', Carbon::parse($dateFrom)->startOfDay());
            })
            ->when($this->filters['date_to'] ?? null, function ($query, $dateTo) {
                $query->where('date', '<=', Carbon::parse($dateTo)->endOfDay());
            });
    }

    public function headings(): array
    {
        return [
            'Employee',
            'Date',
            'Location',
            'Opening Balance',
            'Product Delivery Amount',
            'Expense Amount',
            'Market Cost',
            'TA/DA',
            'Total Amount',
            'Current Balance',
            'Notes',
            'Last Updated By',
        ];
    }

    public function map($balanceSheet): array
    {
        return [
            $balanceSheet->employee->name,
            $balanceSheet->date->format('Y-m-d'),
            $balanceSheet->location,
            $balanceSheet->opening_balance,
            $balanceSheet->product_delivery_amount,
            $balanceSheet->expense_amount,
            $balanceSheet->market_cost,
            $balanceSheet->ta_da,
            $balanceSheet->getTotalAmount(),
            $balanceSheet->current_balance,
            $balanceSheet->notes,
            $balanceSheet->updatedByUser?->name ?? 'System',
        ];
    }
}
