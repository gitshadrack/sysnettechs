<?php

namespace App\Http\Controllers;

use App\Models\Content;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ContentController extends Controller
{
    private const TYPES = 'in:services,projects,products,posts,testimonials,team,careers,faqs,settings';

    public function index(string $type): JsonResponse
    {
        return response()->json(
            Content::where('type', $type)
                ->where('status', 'published')
                ->orderBy('sort_order')
                ->latest('published_at')
                ->paginate(20)
        );
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $data = $request->validate([
            'type' => ['nullable', self::TYPES],
            'status' => ['nullable', 'in:draft,published,archived'],
        ]);

        $items = Content::query()
            ->when($data['type'] ?? null, fn ($query, $type) => $query->where('type', $type))
            ->when($data['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->orderBy('type')
            ->orderBy('sort_order')
            ->latest()
            ->paginate(50);

        return response()->json($items);
    }

    public function store(Request $request): JsonResponse
    {
        return response()->json(Content::create($this->validated($request)), 201);
    }

    public function show(Content $content): JsonResponse
    {
        return response()->json($content);
    }

    public function update(Request $request, Content $content): JsonResponse
    {
        $content->update($this->validated($request, true));

        return response()->json($content->fresh());
    }

    public function destroy(Content $content): JsonResponse
    {
        $content->delete();

        return response()->json(null, 204);
    }

    private function validated(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';
        $data = $request->validate([
            'type' => [$required, self::TYPES],
            'title' => [$required, 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:1000'],
            'body' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:500'],
            'meta_title' => ['nullable', 'string', 'max:70'],
            'meta_description' => ['nullable', 'string', 'max:170'],
            'status' => ['nullable', 'in:draft,published,archived'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'published_at' => ['nullable', 'date'],
            'data' => ['nullable', 'array'],
        ]);

        if (isset($data['title']) && ! isset($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        return $data;
    }
}
