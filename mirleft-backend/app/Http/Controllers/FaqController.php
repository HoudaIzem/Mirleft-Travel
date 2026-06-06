<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFaqRequest;
use App\Http\Requests\UpdateFaqRequest;
use App\Models\Faq;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index(Request $request)
    {
        $query = Faq::query();

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        return response()->json($query->orderBy('category')->orderBy('id')->get());
    }

    public function store(StoreFaqRequest $request)
    {
        $this->authorize('create', Faq::class);

        $faq = Faq::create($request->validated());

        return response()->json(['message' => 'FAQ created', 'data' => $faq], 201);
    }

    public function update(UpdateFaqRequest $request, Faq $faq)
    {
        $this->authorize('update', $faq);

        $faq->update($request->validated());

        return response()->json(['message' => 'FAQ updated', 'data' => $faq]);
    }

    public function destroy(Faq $faq)
    {
        $this->authorize('delete', $faq);
        $faq->delete();

        return response()->json(['message' => 'FAQ deleted']);
    }
}
