<?php

return [
    'exports' => [
        'chunk_size' => 1000,
        'allowed_types' => ['excel', 'csv', 'pdf'],
        'default_type' => 'excel',
        'pdf' => [
            'paper_size' => 'a4',
            'orientation' => 'landscape',
        ],
    ],

    'imports' => [
        'chunk_size' => 1000,
        'allowed_types' => ['xlsx', 'csv'],
        'validate_rows' => true,
        'skip_empty_rows' => true,
    ],

    'paths' => [
        'temp' => storage_path('app/temp'),
        'exports' => storage_path('app/exports'),
        'imports' => storage_path('app/imports'),
    ]
];
